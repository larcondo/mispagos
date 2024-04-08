const testUser = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'j.doe@gmail.com',
  name: 'johndoe',
  password: 'sekret123',
};

const routes = {
  LOGIN_ROUTE: '/api/login',
  LOGOUT_ROUTE: '/api/logout',
  PAGOS_ROUTE: '/api/pagos',
  TESTING_ROUTE: '/api/testing',
}

const registerBodies = {
  missingName: { message: 'El nombre del usuario es requerido.' },
  missingPassowrd: { message: 'El password del usuario es requerido.' },
  userExists: { message: 'El usuario con ese nombre ya existe.' },
};

const loginBodies = {
  missingName: { message: 'El nombre del usuario es requerido.' },
  missingPassowrd: { message: 'El password del usuario es requerido.' },
  wrongUsername: { message: 'El usuario con ese nombre no existe.', error: 'user'},
  wrongPassword: { message: 'El password es incorrecto.', error: 'password'},
};

const logoutBodies = {
  logoutOk: { message: 'Logout successfully' },
  tokenRequired: { message: 'Refresh Token required'},
  
};

const configBodies = {
  missingFirstName: { message: 'firstName REQUERIDO' },
  missingLastName: { message: 'lastName REQUERIDO' },
  missingEmail: { message: 'email REQUERIDO' },
  invalidEmail: { message: 'email INVALIDO'},
};

const testPagos = [
  {
    tipo: 'pago',
    fecha: '2023-11-01',
    detalle: 'Alquiler',
    importe: 20000,
    vencimiento: '2023-11-05',
    observaciones: 'Alquiler noviembre 23',
  },
  {
    tipo: 'pago',
    fecha: '2023-11-03',
    detalle: 'Electricidad',
    importe: 1532.25,
    vencimiento: '2023-11-04',
    observaciones: 'Mes de Noviembre',
  },
  {
    tipo: 'divisas',
    fecha: '2023-11-08',
    detalle: 'Compra dolar',
    importe: 200,
    vencimiento: '2023-11-08',
    observaciones: '',
  },
  {
    tipo: 'pago',
    fecha: '2023-11-04',
    detalle: 'Gas',
    importe: 0,
    vencimiento: '2023-11-10',
    observaciones: 'Mes de Noviembre',
  },
  {
    tipo: 'divisas',
    fecha: '2023-12-15',
    detalle: 'Compra dolar',
    importe: 100,
    vencimiento: '2023-12-15',
    observaciones: '',
  },
];

// Importante: verificar orden según lo que se testea
const testOptions = {
  detalles: ['Alquiler', 'Compra dolar', 'Electricidad', 'Gas'],
  months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',],
  years: ['2023'],
  tipos: ['divisas', 'pago' ],
};

const testNewPago = {
  tipo: 'pago',
  fecha: '2023-12-09',
  detalle: 'Expensas',
  importe: 2510.75,
  vencimiento: '2023-12-15',
  observaciones: 'Exp Diciembre',
};

module.exports = {
  testUser,
  routes,
  registerBodies,
  loginBodies,
  logoutBodies,
  configBodies,
  testPagos,
  testOptions,
  testNewPago,
};