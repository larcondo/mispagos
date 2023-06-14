const express = require('express');
const router = express.Router();
const pagosController = require('../../controllers/api/pagosController');
const verifyToken = require('../../middleware/verifyToken');

router.get('/', verifyToken, pagosController.getPagos);
router.post('/', verifyToken, pagosController.addPago);
router.put('/:id', verifyToken, pagosController.updatePago);
router.delete('/:id', verifyToken, pagosController.deletePago);

module.exports = router;