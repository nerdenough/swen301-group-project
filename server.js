'use strict';
var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var logger = require('morgan');
var mysql = require('mysql');

// Config
var config = require('./config');

// DB
var db = mysql.createConnection(config.mysql);

// Custom routes
var auth = require('./routes/auth');
var index = require('./routes/index');
var data = require('./routes/data');
var price = require('./routes/price');

// Server setup
var app = express();
var server = http.createServer(app);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  secret: 'todo',
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}));

app.use(express.static(path.join(__dirname, 'public')));

// Global route
app.use(function(req, res, next) {
  req.db = db;
  req.config = config;
  next();
});

// Define routes
app.use('/', index);
app.use('/auth', auth);
app.use('/data', data);
app.use('/price', price);

// Catch 404 errors
// Forwarded to the error handlers
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Development error handler
// Displays stacktrace to the user
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
// Does not display stacktrace to the user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: ''
  });
});

server.listen(process.env.PORT || 3000);
module.exports = app;
