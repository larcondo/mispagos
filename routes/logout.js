const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');

// VERIFICAR VERBO HTTP (get, post, delete...)
router.get('/', logoutController.handleLogout );

module.exports = router;