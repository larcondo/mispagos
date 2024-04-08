const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);

const Usuarios = require('../../schemas/Usuarios');

const LOGIN_ROUTE = '/api/login';

const { testUser, loginBodies } = require('../test_helpers');

beforeEach( async () => {
  // se vacía la collección Usuarios
  await Usuarios.deleteMany({});

  await api.post('/api/register').send(testUser);
});

describe('loguear usuario', () => {
  it('logueo exitoso', async () => {
    const response = await api
      .post(LOGIN_ROUTE)
      .send({ name: testUser.name, password: testUser.password })
    
    expect(response.status).toBe(200);
    expect(response.body).not.toBe(null);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('userData');
    
    expect(response.body.message).toBe('Login successfull...');

    const {password, ...testUserWithoutPassword} = testUser;
    expect(response.body.userData).toMatchObject(testUserWithoutPassword);

    // verifico si existe la cookie 'refreshToken'
    expect(response.header).toHaveProperty('set-cookie');
    expect(response.header['set-cookie']
      .filter( c => c.includes('refreshToken'))
      .length
    ).toBe(1);

  });

  it('logueo sin nombre de usuario', async () => {
    const response = await api
      .post(LOGIN_ROUTE)
      .send({ password: testUser.password });
    
    expect(response.status).toBe(400);
    expect(response.body).not.toBe(null);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toEqual(loginBodies.missingName);

  });

  it('logueo sin password', async () => {
    const response = await api
      .post(LOGIN_ROUTE)
      .send({ name: testUser.name });
    
      expect(response.status).toBe(400);
      expect(response.body).not.toBe(null);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toEqual(loginBodies.missingPassowrd);
  });

  it('logueo con password incorrecto', async () => {
    const response = await api
      .post(LOGIN_ROUTE)
      .send({ name: testUser.name, password: 'wrongpassword' });

    expect(response.status).toBe(401);
    expect(response.body).not.toBe(null);
    expect(response.body).toEqual(loginBodies.wrongPassword);
  });

  it('logueo con nombre de usuario no existente', async () => {
    const response = await api
      .post(LOGIN_ROUTE)
      .send({ name: 'randomuser', password: testUser.password });

    expect(response.status).toBe(401);
    expect(response.body).not.toBe(null);
    expect(response.body).toEqual(loginBodies.wrongUsername);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});