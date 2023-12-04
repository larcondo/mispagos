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

// ------------------------------------------------------
// RESUMEN USUARIO (SUMMARY)
// ------------------------------------------------------
const summary = async (req, res) => {
  const username = req.user.name
  const today = new Date()
  const mm = today.toLocaleString('default', { month: 'numeric' })
  const yyyy = today.toLocaleString('default', { year: 'numeric' })
  const mname = today.toLocaleString('default', { month: 'long' })
  const lastMonth = `${yyyy}-${mm}`

  try {
    const lastEight = await Pagos
      .find({ username: username })
      .sort({ fecha: -1 })
      .limit(8)

    const pagosLastMonth = await Pagos
      .find({ username: username, fecha: { $regex: lastMonth }})
      .sort({ fecha: -1 })

    let values = null

    if (pagosLastMonth.length > 0) {
      const importesLastMonth = pagosLastMonth.map(p => p.importe)
      values = {
        min: Math.min(...importesLastMonth),
        max: Math.max(...importesLastMonth),
        total: importesLastMonth.reduce((acc, cv) => acc + cv, 0),
        quantity: importesLastMonth.length,
        monthName: mname.charAt(0).toUpperCase() + mname.slice(1),
      }
      values.average = values.total / values.quantity
    }   

    res.status(200).send({
      message: 'summary',
      lastMonth: lastMonth,
      values,
      pagosLastMonth,
      lastEight,
    })
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: 'Hubo un error al obtener los pagos' });
  }
}

module.exports = {
  getPagos,
  addPago,
  updatePago,
  deletePago,
  summary,
}