const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../../app');
const api = supertest(app);

const Pagos = require('../../../schemas/Pagos');

const {
  routes,
  testPagos,
  testUser,
  testOptions,
  testNewPago,
} = require('../../test_helpers');
const {
  PAGOS_ROUTE,
  LOGIN_ROUTE,
  TESTING_ROUTE,
} = routes;

var accessToken = '';

beforeEach(async () => {
  await api.post(`${TESTING_ROUTE}/reset`);
  await api.post('/api/register').send(testUser);

  const response = await api
    .post(LOGIN_ROUTE)
    .send({ name: testUser.name, password: testUser.password })
    
  accessToken = response.body.accessToken;

  await api
    .post(`${TESTING_ROUTE}/init-pagos`)
    .set({ authorization: `Bearer ${accessToken}`})
});

describe('api Pagos', () => {
  describe('obtener pagos', () => {
    it('sin loguearse', async () => {
      const res = await api
        .get(PAGOS_ROUTE)
      
      expect(res.status).toBe(401);
    });
  
    it('logueado', async () => {
      const res = await api
        .get(PAGOS_ROUTE)
        .set({ authorization: `Bearer ${accessToken}` })
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('options');
      expect(res.body).toHaveProperty('resultado');
      
      const { message, resultado, options } = res.body;
      expect(message).toBe('getPagos');
      expect(options).toEqual(testOptions);
      expect(resultado.length).toBe(testPagos.length);
  
      const formattedRes = resultado.map(p => {
        const {_id, __v, ...pago} = p;
        return pago;
      });
  
      // ordenar por fecha
      testPagos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  
      expect(formattedRes).toMatchObject(testPagos);
  
    });
  });
  
  describe('resumen de usuario', () => {
    it('sin loguear', async () => {
      const res = await api
        .get(`${PAGOS_ROUTE}/summary`)
      
      expect(res.status).toBe(401);
    });

    it('logueado', async () => {
      const res = await api
        .get(`${PAGOS_ROUTE}/summary`)
        .set({ authorization: `Bearer ${accessToken}` })

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('summary');
      
      expect(res.body).toHaveProperty('lastMonth');
      expect(res.body.lastMonth).toBe('2024-04');

      expect(res.body).toHaveProperty('values');
      expect(res.body.values).toBe(null);

      expect(res.body).toHaveProperty('pagosLastMonth');
      expect(res.body.pagosLastMonth.length).toBe(0);
      
      expect(res.body).toHaveProperty('lastEight');
      expect(res.body.lastEight.length).toBe(5);
    });
  });

  describe('crear/guardar pago', () => {
    it('sin loguearse', async () => {
      const res = await api
        .post(PAGOS_ROUTE)
        .send(testNewPago)
      
      expect(res.status).toBe(401);
    });

    it('con todos los campos requridos', async () => {
      const res = await api
        .post(PAGOS_ROUTE)
        .set({ authorization: `Bearer ${accessToken}` })
        .send(testNewPago)
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('added');
  
      expect(res.body.message).toBe('Pago agregado correctamente');
  
      const { _id, __v, ...formattedAdded } = res.body.added;
      expect(formattedAdded).toEqual({ ...testNewPago, username: testUser.name });
  
      const pagosAlFinal = await Pagos.find({});
      expect(pagosAlFinal.length).toBe(testPagos.length + 1);
    });

    it('con campos faltantes', async () => {
      delete testNewPago.importe;
      const res = await api
        .post(PAGOS_ROUTE)
        .set({ authorization: `Bearer ${accessToken}` })
        .send(testNewPago)

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('El campo importe es obligatorio');
    });

    it('con importe tipo string', async () => {
      const res = await api
        .post(PAGOS_ROUTE)
        .set({ authorization: `Bearer ${accessToken}` })
        .send({ ...testNewPago, importe: '203.4' })
    
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Tipo erróneo de <importe>. Debe ser: numero.');
    });
  });

  describe('actualizar pago', () => {
    it('logueado', async () => {
      const pagosAlInicio = await Pagos.find({});
      const updated = { ...pagosAlInicio[0]._doc, importe: 200 };

      const res = await api
        .put(`${PAGOS_ROUTE}/${pagosAlInicio[0].id}`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send(updated)
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('updated');
      expect(res.body.message).toBe('Pago actualizado correctamente');
      
      expect(res.body.updated.importe).not.toBe(pagosAlInicio[0]._doc);
      
      expect(res.body.updated.importe).toBe(200);

      expect(res.body.updated.detalle).toEqual(updated.detalle);
      expect(res.body.updated.fecha).toEqual(updated.fecha);
      expect(res.body.updated.importe).toEqual(updated.importe);
      expect(res.body.updated.observaciones).toEqual(updated.observaciones);
      expect(res.body.updated.tipo).toEqual(updated.tipo);
    });

    it('sin loguear', async () => {
      const pagosAlInicio = await Pagos.find({});
      const updated = { ...pagosAlInicio[0]._doc, importe: 200 };

      const res = await api
        .put(`${PAGOS_ROUTE}/${pagosAlInicio[0].id}`)
        .send(updated)
      
      expect(res.status).toBe(401);
    });

    it('con formato incorreco de id', async () => {
      const pagosAlInicio = await Pagos.find({});
      const updated = { ...pagosAlInicio[0]._doc, importe: 200 };

      const res = await api
        .put(`${PAGOS_ROUTE}/34dbac42`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send(updated)
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('El formato de id no es correcto.');
    });
  });

  describe('eliminar pago', () => {
    it('sin loguearse', async () => {
      const pagosAlInicio = await Pagos.find({});
      const { id } = pagosAlInicio[1];
  
      const res = await api
        .delete(`${PAGOS_ROUTE}/${id}`)
      
      expect(res.status).toBe(401);
      
      const pagosAlFinal = await Pagos.find({});
      expect(pagosAlFinal.length).toBe(pagosAlInicio.length);
    });

    it('con id existente', async() => {
      const pagosAlInicio = await Pagos.find({});
      const { id } = pagosAlInicio[2];
  
      const res = await api
        .delete(`${PAGOS_ROUTE}/${id}`)
        .set({ authorization: `Bearer ${accessToken}` })
  
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('Pago eliminado correctamente');
  
      const pagosAlFinal = await Pagos.find({});
      expect(pagosAlFinal.length).toBe(pagosAlInicio.length - 1);
    });
  
    it('con id inexistente', async () => {
      const randomId = new mongoose.Types.ObjectId();
  
      const res = await api
        .delete(`${PAGOS_ROUTE}/${randomId.toString()}`)
        .set({ authorization: `Bearer ${accessToken}` })
  
      expect(res.status).toBe(203);
    });
  });
  
});

afterAll(async () => {
  await mongoose.connection.close();
});


/*
► Resumen
  ○ Con token
  ○ Sin token (middleware)     
► Obtener Pagos
  ○ Con token
  ○ Sin token (middleware)
► Agregar Pago
  ○ Con token
  ○ Con algún campo requerido faltante
  ○ Sin token (middleware)
► Actualizar Pago
  ○ Con token
  ○ Sin token (middleware)
  - Con id erroneo
► Eliminar Pago    
  ○ Con token
  ○ Con id no existente
  ○ Sin token (middleware)




 --testPathPattern='__tests__\/(.*).test.js$'

*/