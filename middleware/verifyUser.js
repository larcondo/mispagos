const Usuarios = require('../schemas/Usuarios');

const verifyUser = async (req, res, next) => {
  const { name, password } = req.body

  try {
    const userExists = await Usuarios.exists({ name: name });
    if (!userExists) return res.status(400).send({ message: `El usuario ${name} no existe` });

    const userData = await Usuarios.findOne({ name: name });
    if (userData.password !== password) return res.status(401).send({ message: 'Password incorrecto'});

    next();

  } catch (err) {
    console.log(err);
    res.send({ message: 'Hubo un error al verificar el usuario' });
  }
};

module.exports = verifyUser;