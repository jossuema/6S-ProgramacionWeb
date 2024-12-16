const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

let users = [{ id: 1, name: "Alice" }];

// GET - Obtener usuarios
app.get('/users', (req, res) => res.json(users));

// POST - Crear usuario
app.post('/users', (req, res) => {
    const user = { id: users.length + 1, ...req.body };
    users.push(user);
    res.json(user);
});

// PUT - Actualizar usuario
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        users[userIndex] = { id: userId, ...req.body };
        res.json(users[userIndex]);
    } else {
        res.status(404).send('Usuario no encontrado');
    }
});

// DELETE - Eliminar usuario
app.delete('/users/:id', (req, res) => {
    users = users.filter(user => user.id !== parseInt(req.params.id));
    res.json({ message: "Usuario eliminado" });
});

app.listen(PORT, () => console.log(`RESTful API en http://localhost:${PORT}`));