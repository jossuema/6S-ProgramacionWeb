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

app.post('/login', async (req, res) => {
    try {
        const { username, psw } = req.body;
        if (!username || !psw) {
            return res.status(400).json({ message: 'Faltan credenciales' });
        }
        const user = await getUserAuth(username, psw);
        if (!user) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'defaultSecret',
            { expiresIn: '15m' }
        );
        res.status(200).json({
            message: 'Autenticación correcta',
            token: token,
        });
    } catch (error) {
        console.error('Error en /login:', error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

module.exports = app;