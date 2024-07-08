const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

// CORS: Cross Origin Resource Sharing
const whiteList = [process.env.HOST_URL]
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not Allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

//middleware for cookies
app.use(cookieParser());

app.use(express.json());

app.use(express.static('dist'));

const MONGODB_URI = (process.env.NODE_ENV === 'test')
  ? process.env.TEST_DATABASE_URI
  : process.env.DATABASE_URI;

// Database
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado a la base de datos...'))
  .catch( error => console.log(error));

// routes
app.use('/info', require('./routes/root'));
app.use('/api/login', require('./routes/login'));
app.use('/api/register', require('./routes/register'));
app.use('/api/refresh', require('./routes/refresh'));
app.use('/api/logout', require('./routes/logout'));
app.use('/api/config', require('./routes/config'));
app.use('/api/pagos', require('./routes/api/pagos'));
app.use('/api/demo', require('./routes/api/demo'));

if (process.env.NODE_ENV === 'test') {
  app.use('/api/testing', require('./routes/testing'));
}

app.all('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Not Found' });
});

module.exports = app;