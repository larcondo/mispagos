const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');
const api = supertest(app);

const Usuarios = require('../../schemas/Usuarios');

// helper
const { testUser, registerBodies } = require('../test_helpers');

const REGISTER_ROUTE = '/api/register';

beforeEach( async () => {
  // se vacía la collección Usuarios
  await Usuarios.deleteMany({});
});

describe('registrar usuario', () => {
  it('registrar usuario con datos completos', async () => {
    await api
      .post(REGISTER_ROUTE)
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  });

  it('nombre de usuario requerido', async () => {
    const response = await api
      .post(REGISTER_ROUTE)
      .send({ password: testUser.password })
    
    expect(response.status).toBe(400);
    expect(response.type).toBe('application/json');
    expect(response.body).not.toBe(null);
    expect(response.body).toEqual(registerBodies.missingName);

    // await api
    //   .post('/api/register')
    //   .send({ password: testUser.password })
    //   .expect(400)
    //   .expect('Content-Type', /application\/json/)
    //   .expect({ message: 'El nombre del usuario es requerido.' })
    
  });

  it('password requerido', async () => {
    const { password, ...testUserWithoutPassword } = testUser;
    
    const response = await api
      .post(REGISTER_ROUTE)
      .send(testUserWithoutPassword)
    
    expect(response.status).toBe(400);
    expect(response.type).toBe('application/json');
    expect(response.body).not.toBe(null);
    expect(response.body).toEqual(registerBodies.missingPassowrd);
  });

  it('registrar usuario existente', async () => {
    const response = await api
      .post(REGISTER_ROUTE)
      .send(testUser)

    expect(response.status).toBe(201);

    const response2 = await api
      .post(REGISTER_ROUTE)
      .send(testUser)
    
    expect(response2.status).toBe(200);   // <----- MODIFICAR en Controller
    expect(response2.body).toEqual(registerBodies.userExists);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});