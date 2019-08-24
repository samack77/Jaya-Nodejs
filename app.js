// Initial dependencies
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// API dependencies
const mongoose = require('mongoose');
const cors = require('cors');

// Models
require('./models/user');

// Routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth', authRouter);

// Iniciamos el servidor y la base de datos
mongoose.connect('mongodb://localhost:27017/jaya', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',  function() {
	// Comprobar errores siempre
	console.log("mongose connected")
})

module.exports = app;
