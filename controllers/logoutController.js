const RefreshTokens = require('../schemas/RefreshTokens');

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  const { refreshToken } = cookies;

  // check if cookies object has a null prototype (no cookies set)
  if (!Object.getPrototypeOf(cookies)) return res.sendStatus(401);
  
  if ( refreshToken === null || refreshToken === undefined ) return res.status(400).send({ message: 'Refresh Token required'});
  
  // const { name } = req.body;
  // if ( name === null || name === undefined ) return res.status(400).send({ message: 'Nombre de usuario requerido'});
  
  try {
    await RefreshTokens.deleteOne({ token: refreshToken });
    // consssole.log(resultado);
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.status(200).send({ message: 'Logout successfully' });
  } catch(err) {
    console.log(err);
    res.send({ message: 'Hubo un error en el Logout' });
  }
}

module.exports = { handleLogout }