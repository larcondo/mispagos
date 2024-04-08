const bcrypt = require('bcrypt');
const Usuarios = require('../schemas/Usuarios');
const RefreshTokens = require('../schemas/RefreshTokens');
const { 
  generateAccessToken,
  generateRefreshToken
} = require('../helpers/generateTokens');

const handleLogin = async (req, res) => {
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
    const nameExists = await Usuarios.exists({ name: userInfo.name });

    if (!nameExists) return res.status(401).send({ message: 'El usuario con ese nombre no existe.', error: 'user'});

    const user = await Usuarios.findOne({ name: userInfo.name })
    const checkPassword = await bcrypt.compare(userInfo.password, user.password) 

    if (!checkPassword) return res.status(401).send({ message: 'El password es incorrecto.', error: 'password'});

    const accessToken = generateAccessToken({ name: userInfo.name });
    const refreshToken = generateRefreshToken({ name: userInfo.name });

    // Se guarda el refreshToken
    if (await RefreshTokens.exists({ name: userInfo.name })) {
      const resUpdate = await RefreshTokens.updateOne({ name: userInfo.name }, { $set: { token: refreshToken }});
      // console.log(resUpdate);
    } else {
      const resAdd = await RefreshTokens.insertMany({ name: userInfo.name, token: refreshToken });
      // console.log(resAdd);
    }

    const { password, __v, ...userData } = user._doc;
    // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, maxAge: 60 * 60 * 1000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 60 * 60 * 1000 });
    res.send({ message: 'Login successfull...', accessToken: accessToken, userData });
  } catch (err) {
    console.log(err)
    res.send({ message: 'Hubo un error en el Login' });
  }
}

module.exports = { handleLogin }