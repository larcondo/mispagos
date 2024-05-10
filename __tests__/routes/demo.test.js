const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);

const Usuarios = require('../../schemas/Usuarios');
const Pagos = require('../../schemas/Pagos');

const DEMO_KEY = process.env.DEMO_API_KEY;

const { demoUser, demoPagos } = require('../../helpers/demoData');

beforeEach( async () => {
  await Usuarios.deleteMany({});
  await Pagos.deleteMany({});
});

describe('demo', () => {
  it('get / - sin key', async () => {
    const res = await api
      .get('/api/demo')
    
    expect(res.status).toBe(401);
  });

  it('get / - con key incorrecta', async () => {
    const res = await api
      .get('/api/demo/?key=dc04045c945a5c1ca9d3a1e2442f6a0552bba3d63223b95aaa20457d15f166b0')
    
    expect(res.status).toBe(403);
  });

  it('get /', async () => {
    const res = await api
      .get(`/api/demo/?key=${DEMO_KEY}`)
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body).toHaveProperty('pagos');
    expect(res.body).toHaveProperty('users');

    expect(res.body.message).toBe('GET DEMO');
    expect(res.body.users).toHaveLength(0);
    expect(res.body.pagos).toHaveLength(0);

  });

  describe('reset demo', () => {
    it('reset demo', async () => {
      const res = await api
        .post(`/api/demo/reset/?key=${DEMO_KEY}`)
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message');
  
      expect(res.body.userAdded).toHaveLength(1);
      expect(res.body.pagosAdded).toHaveLength(demoPagos.length);
  
      expect(res.body.userAdded[0]).toMatchObject(demoUser);
  
      for(let i = 0; i < demoPagos.length; i++) {
        expect(res.body.pagosAdded[i]).toMatchObject(demoPagos[i]);
      }
    });
  });

  describe('verify demo', () => {
    it('no data', async () => {
      const res = await api
        .get(`/api/demo/verify/?key=${DEMO_KEY}`)
      
      expect(res.status).toBe(200);
      expect(res.body.demoStatus.user).toBe(false);
      expect(res.body.demoStatus.pagos).toBe(false);
      expect(res.body).toEqual({
        message: 'OK: api/demo/verify',
        demoStatus: {
          user: false,
          pagos: false,
        }
      });
    });
  
    it('correct data', async () => {
      const res1 = await api
        .post(`/api/demo/reset/?key=${DEMO_KEY}`)
  
      expect(res1.status).toBe(200);
  
      const res2 = await api
        .get(`/api/demo/verify/?key=${DEMO_KEY}`)
      
      expect(res2.status).toBe(200);
      expect(res2.body.demoStatus.user).toBe(true);
      expect(res2.body.demoStatus.pagos).toBe(true);
      expect(res2.body).toEqual({
        message: 'OK: api/demo/verify',
        demoStatus: {
          user: true,
          pagos: true,
        }
      });
    });
  
    it('data modified', async () => {
      const res1 = await api
        .post(`/api/demo/reset/?key=${DEMO_KEY}`)
  
      expect(res1.status).toBe(200);
  
      const actualPagos = await Pagos.find();
      await Pagos.updateOne(
        { _id: actualPagos[3]._id },
        { importe: 0 },
      );
  
      const res2 = await api
        .get(`/api/demo/verify/?key=${DEMO_KEY}`)
      
      expect(res2.status).toBe(200);
      expect(res2.body.demoStatus.user).toBe(true);
      expect(res2.body.demoStatus.pagos).toBe(false);
      expect(res2.body).toEqual({
        message: 'OK: api/demo/verify',
        demoStatus: {
          user: true,
          pagos: false,
        }
      });
    });
  });
  
});

afterAll(async () => {
  await mongoose.connection.close();
});