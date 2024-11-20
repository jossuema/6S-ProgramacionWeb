const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { getUserAuth } = require('./controllers/users');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 solicitudes por IP en 15 minutos
    message: 'Demasiadas solicitudes desde esta IP. Por favor, inténtalo de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use(require('./routes/employees'));
app.use(require('./routes/departments'));

//ruta para generar token
app.post('/login', (req, res) => {
    // simulacion de usuario
    const { username, psw } = req.body;
    console.log(username, psw);
    const user = getUserAuth(username, psw);

    if(!user){
        res.json(
            { 
                message: 'Credenciales incorrectas'
            }
        )
        return;
    }

    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

module.exports = app;