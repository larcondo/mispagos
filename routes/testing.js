const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');

const Usuarios = require('../schemas/Usuarios');
const Pagos = require('../schemas/Pagos');

const { testPagos } = require('../__tests__/test_helpers');

router.post('/reset', async (req, res) => {
  await Usuarios.deleteMany({});
  await Pagos.deleteMany({});
  res.status(204).end();
});

router.post('/init-pagos', verifyToken, async (req, res) => {
  const username = req.user.name;

  const fakePagos = testPagos.map( p => {
    return {...p, username};
  });

  try {
    await Pagos.insertMany(fakePagos);
    res.status().send({ message: 'Pagos inicializados (testing).'});
  } catch(e) {
    res.status(500).send({
      message: 'Error al inicializar pagos para testing.',
    });
  }
});

module.exports = router;