const pool = require('../database');

const getEmpleado = async (req, res) => {
    try {
        const client = await pool.connect();
        const { limit, offset } = req.query;
        const response = await pool.query('SELECT * FROM employees LIMIT $1 OFFSET $2', [limit, offset]);
        client.release();
        res.json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const getEmpleadoByName = async (req, res) => {
    try {
        const client = await pool.connect();
        const response = await pool.query('SELECT * FROM actores WHERE first_name LIKE $1 OR last_name LIKE $1', [`%${req.params.nombre}%`]);
        client.release();
        if (response.rows.length === 0) {
            res.status(404).send('Empleado no encontrado');
        } else {
            res.json(response.rows);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const insertEmpleado = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;
        const client = await pool.connect();
        const response = await pool.query('INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id]);
        client.release();
        res.json({
            message: 'Empleado agregado correctamente',
            body: {
                employee : {first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id}
            }
        });
    }catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const deleteEmpleado = async (req, res) => {
    try {
        const client = await pool.connect();
        const response = await pool.query('DELETE FROM employees WHERE employee_id = $1', [req.params.id]);
        client.release();
        res.json(`Empleado con ID ${req.params.id} eliminado correctamente`);
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const updateEmpleado = async (req, res) => {
    try {
        const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;
        const client = await pool.connect();
        const response = await pool.query('UPDATE employees SET first_name = $1, last_name = $2, email = $3, phone_number = $4, hire_date = $5, job_id = $6, salary = $7, commission_pct = $8, manager_id = $9, department_id = $10 WHERE employee_id = $11', [first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id, req.params.id]);
        client.release();
        res.json(`Empleado con ID ${req.params.id} actualizado correctamente`);
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

module.exports = {
    getEmpleado,
    getEmpleadoByName,
    insertEmpleado,
    deleteEmpleado,
    updateEmpleado
};