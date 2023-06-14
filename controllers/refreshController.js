require('dotenv').config();
const jwt = require('jsonwebtoken');
const RefreshTokens = require('../schemas/RefreshTokens');
const { generateAccessToken } = require('../helpers/generateTokens');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) return res.sendStatus(401);

  const refreshToken = cookies.refreshToken;
  if (refreshToken == null) return res.sendStatus(401);
  
  // Verificar RefreshTOken en DB
  const checkRefreshToken = await RefreshTokens.exists({ token: refreshToken });
  if (!checkRefreshToken) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)

    const accessToken = generateAccessToken({ name: user.name });
    res.json({
      accessToken: accessToken,
      expiresIn: 60
    });
  });  
}

module.exports = { handleRefreshToken }