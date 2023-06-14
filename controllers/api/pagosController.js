const Pagos = require('../../schemas/Pagos');

// ------------------------------------------------------
// OBTENER LOS PAGOS
// ------------------------------------------------------
const getPagos = async (req, res) => {

  try {
    const resultado = await Pagos.find({ username: req.user.name }).sort({ fecha: -1 });

    res.status(200).send({ message: 'getPagos', resultado });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Hubo un error al obtener los pagos' });
  }

};

// ------------------------------------------------------
// AGREGAR UN PAGO
// ------------------------------------------------------
const addPago = async (req, res) => {
  const pagoData = req.body;
  const camposObligatorios = [ 'tipo', 'fecha', 'detalle', 'importe', 'username' ];

  // Pasar estas verificaciones a un middleware
  for (let campo of camposObligatorios) {
    if (!pagoData.hasOwnProperty(campo)) return res.status(400).send({ message: `El campo ${campo} es obligatorio`});
  }

  if (typeof(pagoData.importe) !== 'number') return res.status(400).send({ message: 'Tipo erróneo de <importe>. Debe ser: numero.' });

  try {
    await Pagos.insertMany(pagoData);

    res.send({ message: 'Pago agregado correctamente', pagoData });
  } catch (err) {
    console.log(err);
    res.send({ message: 'Hubo un error al agregar el pago' });
  }
};

// ------------------------------------------------------
// ACTUALIZAR UN PAGO
// ------------------------------------------------------
const updatePago = async (req, res) => {
  const pagoData = req.body;
  const pagoId = req.params.id;

  try {
    const resultado = await Pagos.updateOne(
      { _id: pagoId },
      { $set: pagoData }
    );
    // console.log(resultado);
    res.status(200).send({ message: 'Pago actualizado correctamente'});
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Hubo un error al actualizar el pago' });
  }

};

// ------------------------------------------------------
// ELIMINAR UN PAGO POR id
// ------------------------------------------------------
const deletePago = async (req, res) => {
  const pagoId = req.params.id;

  try {
    const resultado = await Pagos.deleteOne({ _id: pagoId });
    const deletedCount = resultado.deletedCount;
    if (deletedCount === 1) {
      res.send({ message: `El pago con el id: ${pagoId} se eliminó correctamente`});
    } else {
      res.send({ message: `No se encontró un pago con el id: ${pagoId}`});
    }
  } catch (err) {
    console.log(err);
    res.send({ message: 'Hubo un error al eliminar el pago' });
  }
};

module.exports = {
  getPagos,
  addPago,
  updatePago,
  deletePago
}