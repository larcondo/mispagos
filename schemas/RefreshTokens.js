const mongoose = require('mongoose');

const refreshTokenSchema = mongoose.Schema({
  name: { type: String, unique: true },
  token: { type: String }
});

module.exports = mongoose.model('RefreshTokens', refreshTokenSchema);