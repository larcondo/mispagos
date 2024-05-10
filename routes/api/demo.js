const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const verifyDemoKey = require('../../middleware/verifyDemoKey');
const Usuarios = require('../../schemas/Usuarios');
const Pagos = require('../../schemas/Pagos');

const { demoUser, demoPagos } = require('../../helpers/demoData');
const { deepEqual } = require('../../helpers/general');

router.get('/', verifyDemoKey, async (req, res) => {
  try {
    const users = await Usuarios.find({ name: demoUser.name }, { password: 0 });
    const pagos = await Pagos.find({ username: demoUser.name });
    
    res.status(200).send({
      message: 'GET DEMO',
      pagos,
      users,
    })
  } catch(e) {
    res.status(500).send({ message: 'GET DEMO error' });
  }
});

router.get('/verify', verifyDemoKey, async (req, res) => {
  let demoStatus = {};
  
  try {
    const dbUsers = await Usuarios.find(
      demoUser,
      { _id: 0, __v: 0 },
    );

    const dbPagos = await Pagos.find(
      { username: demoUser.name },
      { _id: 0, __v: 0 },
    );

    demoStatus.user = (dbUsers.length === 1);

    if (dbPagos.length === demoPagos.length) {
      const pagosUnchanged = demoPagos.map( p => {
        return dbPagos.some( dp => deepEqual(dp._doc, p ))
      }).every( val => val === true);
      
      console.log('Todos iguales?', pagosUnchanged);
      demoStatus.pagos = pagosUnchanged;
    } else {
      demoStatus.pagos = false;
    }

    res.status(200).send({
      message: 'OK: api/demo/verify',
      demoStatus,
    })

  } catch(e) {
    console.log(e.message);
    res.status(500).send({ message: 'Server error: api/demo/verify' });
  }
});

router.post('/reset', verifyDemoKey, async (req, res) => {
  try {
    await Usuarios.deleteOne({ name: demoUser.name });
    await Pagos.deleteMany({ username: demoUser.name });

    const hashedPassword = await bcrypt.hash(process.env.DEMO_USER_PASSWORD, 10);

    const userAdded = await Usuarios.insertMany({ ...demoUser, password: hashedPassword });
    const pagosAdded = await Pagos.insertMany(demoPagos);

    res.status(200).send({
      message: 'DEMO reset successfully',
      userAdded,
      pagosAdded,
    })
  } catch(e) {
    res.status(500).send({ message: 'POST DEMO error' });
  }
});

router.delete('/');

module.exports = router;