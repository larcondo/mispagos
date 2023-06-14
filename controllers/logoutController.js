const RefreshTokens = require('../schemas/RefreshTokens');

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.sendStatus(401);
  const refreshToken = cookies.refreshToken;
  // console.log(`Refresh: ${refreshToken}`)
  
  if ( refreshToken === null || refreshToken === undefined ) return res.status(400).send({ message: 'Refresh Token required'});
  
  // const { name } = req.body;
  // if ( name === null || name === undefined ) return res.status(400).send({ message: 'Nombre de usuario requerido'});
  
  try {
    const resultado = await RefreshTokens.deleteOne({ token: refreshToken });
    // consssole.log(resultado);
    res.clearCookie('refreshToken', { httpOnly: true, secure: true });
    res.status(200).send({ message: 'Logout successfully' });
  } catch(err) {
    console.log(err);
    res.send({ message: 'Hubo un error en el Logout' });
  }
}

module.exports = { handleLogout }