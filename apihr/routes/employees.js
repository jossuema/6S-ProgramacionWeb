const { Router } = require('express');
const router = Router();

var { getEmpleado, getEmpleadoByName, deleteEmpleado, insertEmpleado, updateEmpleado} = require('../controllers/employees');

router.get('/employees', getEmpleado);
router.get('/employees/name/:name', getEmpleadoByName);
router.post('/employees', insertEmpleado);
router.delete('/employees/:id', deleteEmpleado);
router.put('/employees/:id', updateEmpleado);

module.exports = router;