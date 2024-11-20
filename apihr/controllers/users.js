const pool = require('../database');

const getUsers = async (req, res) => {
    try {
        const client = await pool.connect();
        const { limit, offset } = req.query;
        const response = await pool.query('SELECT * FROM users LIMIT $1 OFFSET $2', [limit, offset]);
        client.release();
        res.json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const insertUser = async (req, res) => {
    try {
        const { username, psw } = req.body;
        const client = await pool.connect();
        const response = await pool.query('INSERT INTO users (username, psw) VALUES ($1, $2)', [username, psw]);
        const newdepartment = response.rows[0];
        client.release();
        res.json({
            message: 'Usuario agregado correctamente',
            body: {
                department: newdepartment
            }
        });
    }catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const getUserAuth = async (username, psw) => {
    try{
        const response = await pool.query('SELECT * FROM users WHERE username = $1 AND psw = $2', [username, psw]);
        const user = response.rows[0];
        console.log(user);
        return user;
    }catch (e) {
        console.log(e);
        return null;
    }
}

module.exports = {
    getUsers,
    insertUser,
    getUserAuth
}