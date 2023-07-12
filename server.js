const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const PORT = process.env.PORT || 3000;

// CORS: Cross Origin Resource Sharing
const whiteList = ['https://mispagos.onrender.com/', 'http://localhost:5173', 'http://127.0.0.1:5173'];
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
// app.use(cors({credentials: true, origin: 'http://127.0.0.1:5173'}))
// app.use(cors());   // sin opciones (permite todo)

//middleware for cookies
app.use(cookieParser());

app.use(express.json());

// Database
mongoose.connect(process.env.DATABASE_URI)
  .then(() => console.log('Conectado a la base de datos...'))
  .catch( error => console.log(error));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/config', require('./routes/config'));
app.use('/pagos', require('./routes/api/pagos'));

app.all('*', (req, res) => {
  res.status(404);
  res.send({ message: 'Not Found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
})