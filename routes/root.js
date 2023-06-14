const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const Usuarios = require('../schemas/Usuarios');

router.get('/', async (req, res) => {
  
  try {
    const usuariosDB = await Usuarios.find({}, {_id: 1, name: 1});
    res.send(usuariosDB);
  } catch(e) {
    console.log(e);
    res.send({ message: 'Hubo un error al obtener los usuarios.' });
  }
});

router.post('/', loginController.handleLogin );

module.exports = router;