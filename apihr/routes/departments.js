const { Router } = require('express');
const router = Router();

var { getDepartamentos, insertDepartamentos, deleteDepartamento, updateDepartment, getDepartmentsById } = require('../controllers/departments');
const authenticateToken = require('../middleware/auth');

router.get('/departments', authenticateToken, getDepartamentos);
router.post('/departments', authenticateToken, insertDepartamentos);
router.delete('/departments/:id', authenticateToken, deleteDepartamento);
router.put('/departments/:id', authenticateToken, updateDepartment);
router.get('/departments/:id', authenticateToken, getDepartmentsById);

module.exports = router;