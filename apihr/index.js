const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use(require('./routes/employees'));
app.use(require('./routes/departments'));

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});

module.exports = app;