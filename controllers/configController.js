const Usuarios = require('../schemas/Usuarios');

const updateFirstName = async (req, res) => {
  const { firstName, name } = req.body

  if (!firstName) return res.status(400).send({ message: 'firstName REQUERIDO' });

  try {
    const resultado = await Usuarios.updateOne({ name: name }, { $set : { firstName: firstName }});

    res.status(200).send({ message: `Se actualizó el firstName del usuario ${name}` });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Hubo un error al actualizar el firstName' });
  }
}

const updateLastName = async (req, res) => {
  const { lastName, name } = req.body

  if (!lastName) return res.status(400).send({ message: 'lastName REQUERIDO' });

  try {
    const resultado = await Usuarios.updateOne({ name: name }, { $set : { lastName: lastName }});

    res.status(200).send({ message: `Se actualizó el lastName del usuario ${name}` });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Hubo un error al actualizar el lastName' });
  }
}

const updateEmail = async (req, res) => {
  const { email, name } = req.body
  const emailRegex = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'gm')

  if (!email) return res.status(400).send({ message: 'email REQUERIDO' });
  
  const isValidEmail = emailRegex.test(email)
  if (!isValidEmail) return res.status(400).send({ message: 'email INVALIDO'})

  try {
    const resultado = await Usuarios.updateOne({ name: name }, { $set : { email: email }});

    res.status(200).send({ message: `Se actualizó el email del usuario ${name}` });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Hubo un error al actualizar el email' });
  }
}

module.exports = {
  updateFirstName,
  updateLastName,
  updateEmail
}