const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);

const Usuarios = require('../../schemas/Usuarios');

const { testUser, routes, logoutBodies } = require('../test_helpers');
const { LOGIN_ROUTE, LOGOUT_ROUTE } = routes;

var myCookie = '';

beforeEach( async () => {
  // se vacía la collección Usuarios
  await Usuarios.deleteMany({});

  await api.post('/api/register').send(testUser);

  const response = await api
    .post(LOGIN_ROUTE)
    .send({ name: testUser.name, password: testUser.password })
  
  myCookie = response.header['set-cookie'];
});

describe('logout del usuario', () => {
  it('logout correcto', async () => {
    const response = await api
      .get(LOGOUT_ROUTE)
      .set('Cookie', myCookie)
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(logoutBodies.logoutOk);
  });

  it('logout sin cookie', async () => {
    const response = await api
      .get(LOGOUT_ROUTE)
    
    expect(response.status).toBe(401);
    expect(response.body).toEqual({});
  });

  it('con cookie incorrecta', async () => {
    myCookie[0] = myCookie[0].replace('refreshToken', 'otherToken');

    const response = await api
      .get(LOGOUT_ROUTE)
      .set('Cookie', myCookie)
    
    expect(response.status).toBe(400);
    expect(response.body).toEqual(logoutBodies.tokenRequired);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});