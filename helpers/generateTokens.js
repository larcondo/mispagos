const jwt = require('jsonwebtoken');
require('dotenv').config();

function generateAccessToken( user ) {
  // return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
}

function generateRefreshToken( user ) {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
};