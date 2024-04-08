const Pagos = require('../../schemas/Pagos');
const mongoose = require('mongoose');

// ------------------------------------------------------
// OBTENER LOS PAGOS
// ------------------------------------------------------
const getPagos = async (req, res) => {

  try {
    const resultado = await Pagos.find({ username: req.user.name }).sort({ fecha: -1 });

    // (Opciones) Distintos detalles
    const detalles = await Pagos.distinct('detalle', { username: req.user.name });
    
    // (Opciones) Distintos años
    const aux = await Pagos.distinct('fecha', { username: req.user.name });
    const aux2 = aux.map( f => f.split('-')[0])
    const years = [...new Set(aux2)].sort((a, b) => b - a);   // recent first
    
    // (Opciones) Distintos meses
    const months = [
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
    ]
    
    // (Opciones) Distintos tipos
    const tipos = await Pagos.distinct('tipo', { username: req.user.name });

    res.status(200).send({ 
      message: 'getPagos',
      options: {
        detalles,
        months,
        years,
        tipos,
      },
      resultado,
    });
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
  const camposObligatorios = [ 'tipo', 'fecha', 'detalle', 'importe' ];

  // Pasar estas verificaciones a un middleware
  for (let campo of camposObligatorios) {
    if (!pagoData.hasOwnProperty(campo)) return res.status(400).send({ message: `El campo ${campo} es obligatorio`});
  }

  if (typeof(pagoData.importe) !== 'number') return res.status(400).send({ message: 'Tipo erróneo de <importe>. Debe ser: numero.' });

  try {
    // const updated = await Pagos.insertMany(pagoData);
    const added = await Pagos.create({...pagoData, username: req.user.name });
    res.status(201).send({ message: 'Pago agregado correctamente', added });
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

  if(!mongoose.Types.ObjectId.isValid(pagoId)) {
    return res
      .status(400)
      .send({ message: 'El formato de id no es correcto.' });
  }

  try {
    const updated = await Pagos.findByIdAndUpdate(pagoId, pagoData, { returnDocument: 'after'})
    res.status(200).send({ message: 'Pago actualizado correctamente', updated });
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
    const deleted = await Pagos.findByIdAndDelete(pagoId);
    if (deleted) {
      res.status(200).send({ message: 'Pago eliminado correctamente', deleted });
    } else {
      res.sendStatus(203);
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
  const lastMonth = `${yyyy}-${mm.padStart(2,0)}`

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