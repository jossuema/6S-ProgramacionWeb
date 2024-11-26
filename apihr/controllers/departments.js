const pool = require('../database');

const getDepartamentos = async (req, res) => {
    try {
        const client = await pool.connect();
        const { limit, offset } = req.query;
        const response = await pool.query('SELECT * FROM departments LIMIT $1 OFFSET $2', [limit, offset]);
        client.release();
        res.json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const getDepartmentsById = async (req, res) => {
    try {
        const client = await pool.connect();
        const response = await pool.query('SELECT * FROM departments WHERE department_id = $1', [req.params.id]);
        client.release();
        if (response.rows.length === 0) {
            res.status(404).send('Departamento no encontrado');
        } else {
            res.json(response.rows);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const insertDepartamentos = async (req, res) => {
    try {
        const { department_name, manager_id, location_id } = req.body;
        const client = await pool.connect();
        const response = await pool.query('INSERT INTO departments (department_name, manager_id, location_id) VALUES ($1, $2, $3)', [department_name, manager_id, location_id]);
        const newdepartment = response.rows[0];
        client.release();
        res.json({
            message: 'Departamento agregado correctamente',
            body: {
                department: newdepartment
            }
        });
    }catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const deleteDepartamento = async (req, res) => {
    try {
        const client = await pool.connect();
        console.log(req.params.id);
        
        const response = await pool.query('DELETE FROM departments WHERE department_id = $1', [req.params.id]);
        client.release();
        res.json(`Departamento con ID ${req.params.id} eliminado correctamente`);
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const updateDepartment = async (req, res) => {
    try {
        const { department_name, manager_id, location_id } = req.body;
        const client = await pool.connect();
        const response = await pool.query('UPDATE departments SET department_name = $1, manager_id = $2, location_id = $3 WHERE department_id = $4', [department_name, manager_id, location_id, req.params.id]);
        newdepartment = response.rows[0];
        client.release();
        res.json({
            message: 'Departamento actualizado correctamente',
            body: {
                department: newdepartment
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

module.exports = {
    getDepartamentos,
    insertDepartamentos,
    deleteDepartamento,
    updateDepartment,
    getDepartmentsById
};