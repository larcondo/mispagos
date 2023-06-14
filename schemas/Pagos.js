const mongoose = require('mongoose');

const pagosSchema = mongoose.Schema({
  tipo: String,
  fecha: String,
  detalle: String,
  importe: Number,
  vencimiento: {
    type: String,
    default: null
  },
  observaciones: {
    type: String,
    default: ''
  },
  username: {
    type: String,
    default: 'missing user'
  }
});

module.exports = mongoose.model('Pagos', pagosSchema);