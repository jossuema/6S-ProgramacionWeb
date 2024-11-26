const pool = require('../database');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

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

const getEmpleadoById = async (req, res) => {
    try {
        const client = await pool.connect();
        const response = await pool.query('SELECT * FROM employees WHERE employee_id = $1', [req.params.id]);
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

const importCSV = async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No se ha subido ningún archivo');
    }
  
    console.log('Importando datos a la tabla employees...');
    const filePath = req.file.path;
    const fileRows = [];
  
    try {
      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv.parse({ headers: true }))
          .on('data', (row) => {
            // Validar datos mínimos antes de procesar cada fila
            if (row.employee_id && row.first_name && row.last_name && row.email && row.hire_date && row.job_id) {
              fileRows.push(row);
            }
          })
          .on('end', resolve)
          .on('error', reject);
      });
  
      // Eliminar el archivo temporal después de procesarlo
      fs.unlinkSync(filePath);
  
      if (fileRows.length === 0) {
        return res.status(400).send('El archivo no contiene datos válidos para importar');
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
  
        // Consulta con ON CONFLICT DO UPDATE para evitar duplicados
        const upsertQuery = `
          INSERT INTO employees (
            employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (employee_id)
          DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            email = EXCLUDED.email,
            phone_number = EXCLUDED.phone_number,
            hire_date = EXCLUDED.hire_date,
            job_id = EXCLUDED.job_id,
            salary = EXCLUDED.salary,
            commission_pct = EXCLUDED.commission_pct,
            manager_id = EXCLUDED.manager_id,
            department_id = EXCLUDED.department_id;
        `;
  
        for (const row of fileRows) {
          await client.query(upsertQuery, [
            row.employee_id,
            row.first_name,
            row.last_name,
            row.email,
            row.phone_number || null,
            row.hire_date,
            row.job_id,
            row.salary || null,
            row.commission_pct || null,
            row.manager_id || null,
            row.department_id || null,
          ]);
        }
  
        await client.query('COMMIT');
        res.send('Datos importados y actualizados exitosamente en employees.');
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error durante la importación:', err);
        res.status(500).send('Error al importar los datos.');
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Error al procesar el archivo CSV:', err);
      res.status(500).send('Error al procesar el archivo CSV.');
    }
}

const exportCSV = async (req, res) => {

  const query = 'SELECT * FROM employees';
  try {
    const result = await pool.query(query);

    // Generar CSV
    const filePath = path.join(__dirname, 'employees_export.csv');
    const writeStream = fs.createWriteStream(filePath);
    const csvStream = csv.format({ headers: true });

    csvStream.pipe(writeStream);
    result.rows.forEach(row => {
      csvStream.write(row);
    });
    csvStream.end();

    writeStream.on('finish', () => {
      res.download(filePath, 'employees.csv', (err) => {
        if (err) {
          console.error('Error al exportar:', err);
        }
        fs.unlinkSync(filePath);
      });
    });
  } catch (err) {
    console.error('Error al exportar empleados:', err);
    res.status(500).send('Error al exportar empleados');
  }
}


module.exports = {
    getEmpleado,
    getEmpleadoByName,
    insertEmpleado,
    deleteEmpleado,
    updateEmpleado,
    getEmpleadoById,
    importCSV,
    exportCSV
};