const pool = require('../database');

const getJobs = async (req, res) => {
    try {
        const client = await pool.connect();
        const { limit, offset } = req.query;
        const response = await pool.query('SELECT * FROM jobs');
        client.release();
        res.json(response.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

const getJobById = async (req, res) => {
    try {
        const client = await pool.connect();
        const response = await pool.query('SELECT * FROM jobs WHERE job_id = $1', [req.params.id]);
        client.release();
        if (response.rows.length === 0) {
            res.status(404).send('Trabajo no encontrado');
        } else {
            res.json(response.rows);
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Hubo un error');
    }
}

module.exports = {
    getJobs,
    getJobById
}