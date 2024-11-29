const { Router } = require('express');
const router = Router();

var { getJobs, getJobById } = require('../controllers/jobs');

router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);

module.exports = router;