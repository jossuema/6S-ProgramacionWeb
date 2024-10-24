const { Router } = require('express');
const router = Router();

var { getDepartamentos, insertDepartamentos, deleteDepartamento, updateDepartment } = require('../controllers/departments');

router.get('/departments', getDepartamentos);
router.post('/departments', insertDepartamentos);
router.delete('/departments/:id', deleteDepartamento);
router.put('/departments/:id', updateDepartment);

module.exports = router;