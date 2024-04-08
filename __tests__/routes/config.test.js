const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);

const Usuarios = require('../../schemas/Usuarios');

const LOGIN_ROUTE = '/api/login';
const CONFIG_ROUTE = '/api/config';
CONFIG_ROUTE.replace()
const { testUser, configBodies } = require('../test_helpers');

var accessToken = '';
var wrongToken = '';

beforeEach( async () => {
  // se vacía la collección Usuarios
  await Usuarios.deleteMany({});

  await api.post('/api/register').send(testUser);

  const response = await api
    .post(LOGIN_ROUTE)
    .send({ name: testUser.name, password: testUser.password })
    
  accessToken = response.body.accessToken;
  wrongToken = accessToken
    .replace(
      accessToken.substring(accessToken.length - 4, accessToken.length),
      '0000'
    );
});

describe('configurar datos de usuario', () => {
  describe('configurar first name', () => {
    it('con first name correcto', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/firstname`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send({ firstName: 'Peter' })
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toEqual({ message: `Se actualizó el firstName del usuario ${testUser.name}` });
    });
  
    it('sin enviar first name', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/firstname`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send({})
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toEqual(configBodies.missingFirstName);
    });

    it('sin authorization header', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/firstname`)
        .send({ firstName: 'Peter' })
  
      expect(response.status).toBe(401);
      expect(response.body).toEqual({});
    });

    it('con token incorrecto', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/firstname`)
        .set({ authorization: `Bearer ${wrongToken}` })
        .send({ firstName: 'Peter' })
  
      expect(response.status).toBe(403);
      expect(response.body).toEqual({});
    });
  });

  describe('configurar last name', () => {
    it('con last name correcto', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/lastname`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send({ lastName: 'Griffin' })
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toEqual({ message: `Se actualizó el lastName del usuario ${testUser.name}` });
    });
  
    it('sin enviar last name', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/lastname`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send({})
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toEqual(configBodies.missingLastName);
    });

    it('sin authorization header', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/lastname`)
        .send({ lastName: 'Griffin' })
  
      expect(response.status).toBe(401);
      expect(response.body).toEqual({});
    });

    it('con token incorrecto', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/lastname`)
        .set({ authorization: `Bearer ${wrongToken}` })
        .send({ lastName: 'Griffin' })
  
      expect(response.status).toBe(403);
      expect(response.body).toEqual({});
    });
  });
  
  describe('configurar email', () => {
    it('con email correcto', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/email`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send({ email: 'p.griffin@gmail.com' })
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toEqual({ message: `Se actualizó el email del usuario ${testUser.name}` });
    });
  
    it('sin enviar email', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/email`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send({})
  
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toEqual(configBodies.missingEmail);
    });
  
    it('enviando un email no válido', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/email`)
        .set({ authorization: `Bearer ${accessToken}` })
        .send({ email: 'p.griffin.com' })
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toEqual(configBodies.invalidEmail);
    });

    it('sin authorization header', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/email`)
        .send({ email: 'p.griffin@gmail.com' })
  
      expect(response.status).toBe(401);
      expect(response.body).toEqual({});
    });

    it('con token incorrecto', async () => {
      const response = await api
        .post(`${CONFIG_ROUTE}/email`)
        .set({ authorization: `Bearer ${wrongToken}` })
        .send({ email: 'p.griffin@gmail.com' })
  
      expect(response.status).toBe(403);
      expect(response.body).toEqual({});
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});