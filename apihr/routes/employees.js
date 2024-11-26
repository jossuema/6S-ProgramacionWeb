const { Router } = require('express');
const router = Router();

var { getEmpleado, getEmpleadoByName, deleteEmpleado, insertEmpleado, updateEmpleado, getEmpleadoById, importCSV, exportCSV} = require('../controllers/employees');
const authenticateToken = require('../middleware/auth');

router.get('/employees', authenticateToken, getEmpleado);
router.post('/employees/import', authenticateToken, importCSV);
router.get('/employees/export', authenticateToken, exportCSV);
router.get('/employees/name/:name', authenticateToken, getEmpleadoByName);
router.post('/employees', authenticateToken, insertEmpleado);
router.delete('/employees/:id',authenticateToken, deleteEmpleado);
router.put('/employees/:id', authenticateToken, updateEmpleado);
router.get('/employees/:id', authenticateToken, getEmpleadoById);

module.exports = router;