const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const session = require('express-session');
const csrf = require('csurf');
const winston = require('winston');
const helmet = require('helmet');
const app = express();

const logger = winston.createLogger({
    level: 'info', // Nivel mínimo de log (info, warn, error)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}] - ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log en la consola
        new winston.transports.File({ filename: 'logs/activities.log' }) // Log en archivo
    ]
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 solicitudes por IP en 15 minutos
    message: 'Demasiadas solicitudes desde esta IP. Por favor, inténtalo de nuevo más tarde.',
    onLimitReached: (req, res, options) => {
        logger.warn(`Límite de solicitudes excedido desde la IP: ${req.ip}`);
    }
});

app.use(session({
    secret: 'VODCdHTl',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const csrfProtection = csrf();
app.use(csrfProtection);

app.use(xss());

app.use(limiter);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use(require('./routes/employees'));
app.use(require('./routes/departments'));

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

module.exports = app;