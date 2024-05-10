const mongoose = require('mongoose');

const usuariosSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true  // name debe ser unico
  },
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  roles: {
    type: String,
    default: 'Basic'
  },
  password: String,
});

usuariosSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    delete returnedObj.__v
  }
});

module.exports = mongoose.model('Usuarios', usuariosSchema);