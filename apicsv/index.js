const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('fast-csv');
const { Pool } = require('pg');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'hr',
  password: 'Root800#',
  port: 5432,
});

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha subido ningún archivo');
  }

  console.log('Importando datos desde CSV...');
  const filePath = req.file.path;
  const fileRows = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
          if (row.department_name && row.manager_id && row.location_id) {
            fileRows.push(row);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    fs.unlinkSync(filePath);

    if (fileRows.length === 0) {
      return res.status(400).send('El archivo no contiene datos válidos para importar');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Eliminar datos antiguos (esto puede causar errores si no manejas relaciones)
      await client.query('DELETE FROM departments');

      // Insertar los nuevos datos
      const insertQuery = `INSERT INTO departments (department_name, manager_id, location_id) 
                           VALUES ($1, $2, $3)`;

      for (const row of fileRows) {
        await client.query(insertQuery, [
          row.department_name,
          row.manager_id,
          row.location_id,
        ]);
      }

      await client.query('COMMIT');
      res.send('Datos reemplazados exitosamente');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error durante la importación:', err);
      res.status(500).send('Error al importar los datos');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error al procesar el archivo CSV:', err);
    res.status(500).send('Error al procesar el archivo CSV');
  }
});


// Ruta para exportar datos de PostgreSQL a un archivo CSV
app.get('/export', async (req, res) => {
  console.log('Exportando datos a CSV...');
  const query = 'SELECT * FROM departments';

  try {
    const result = await pool.query(query);

    // Crear un archivo CSV
    const filePath = path.join(__dirname, 'uploads', 'export.csv');
    const writeStream = fs.createWriteStream(filePath);
    const csvStream = csv.format({ headers: true });

    csvStream.pipe(writeStream);
    result.rows.forEach(row => {
      csvStream.write(row);
    });
    csvStream.end();

    writeStream.on('finish', () => {
      res.download(filePath, 'datos_exportados.csv', (err) => {
        if (err) {
          console.error('Error al enviar el archivo:', err);
        }
        fs.unlinkSync(filePath);  // Eliminamos el archivo después de enviarlo
      });
    });

  } catch (err) {
    console.error('Error al consultar la base de datos:', err);
    res.status(500).send('Error al exportar datos');
  }
});

app.use((req, res, next) => {
  res.status(404).send('Ruta no encontrada');
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en el puerto ${PORT}`);
});
