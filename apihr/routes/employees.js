const { Router } = require('express');
const router = Router();

var { getEmpleado, getEmpleadoByName, deleteEmpleado, insertEmpleado, updateEmpleado} = require('../controllers/employees');
const authenticateToken = require('../middleware/auth');

router.get('/employees', authenticateToken, getEmpleado);
router.get('/employees/name/:name', authenticateToken, getEmpleadoByName);
router.post('/employees', authenticateToken, insertEmpleado);
router.delete('/employees/:id',authenticateToken, deleteEmpleado);
router.put('/employees/:id', authenticateToken, updateEmpleado);

module.exports = router;