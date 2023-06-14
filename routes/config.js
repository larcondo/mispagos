const express = require('express');
const router = express.Router();
const configController = require('../controllers/configController');
// const verifyUser = require('../middleware/verifyUser')
const verifyToken = require('../middleware/verifyToken')

router.post('/firstname', verifyToken, configController.updateFirstName);
router.post('/lastname', verifyToken, configController.updateLastName);
router.post('/email', verifyToken, configController.updateEmail);

module.exports = router;