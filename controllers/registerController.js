const bcrypt = require('bcrypt');
const Usuarios = require('../schemas/Usuarios');

const handleRegister = async (req, res) => {
  
  const userInfo = req.body;

  // Validacion de 'name'
  if (userInfo.name === null || userInfo.name === undefined) {
    res.status(400).send({ message: 'El nombre del usuario es requerido.' });
    return
  }
  // Validacion de 'password'
  if (userInfo.password === null || userInfo.password === undefined) {
    res.status(400).send({ message: 'El password del usuario es requerido.' });
    return
  }
  
  try {
    const userExists = await Usuarios.exists({ name: userInfo.name });
    if (userExists) {
      res.send({ message: 'El usuario con ese nombre ya existe.' });
      return;
    }
    
    const hashedPassword = await bcrypt.hash(userInfo.password , 10);
    userInfo.password = hashedPassword;

    const resultado = await Usuarios.insertMany( userInfo );
    // console.log(resultado);
    res.status(201).send({ message: `El usuario ${userInfo.name} fue creado exitosamente.` });
  } catch( err ) {
    console.log(err);
    res.status(500).send({ message: 'Hubo un error al crear el usuario' });
  }
}

module.exports = { handleRegister }