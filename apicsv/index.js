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

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha subido ningún archivo');
  }

  console.log('Importando datos desde CSV...');

  const fileRows = [];

  fs.createReadStream(req.file.path)
  .pipe(csv.parse({ headers: true }))
  .on('data', (row) => {
    fileRows.push(row);  // Cada fila es un objeto con las claves como nombres de columna
  })
  .on('end', () => {

    const insertQuery = `INSERT INTO departments (department_name, manager_id, location_id) VALUES ($1, $2, $3)`;

    fileRows.forEach(async (row) => {
      try {
        await pool.query(insertQuery, [
          row.department_name,
          row.manager_id,
          row.location_id
        ]);
      } catch (err) {
        console.error('Error al insertar los datos:', err);
      }
    });

    res.send('Datos importados exitosamente');
  });
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
