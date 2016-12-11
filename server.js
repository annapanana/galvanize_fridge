'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const users = require('./routes/users');
const token = require('./routes/token');
const admin = require('./routes/admin');
const foods = require('./routes/foods');
const config = require('./knexfile');

const boom = require('boom');

const port = process.env.PORT || 8000;

app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.use(express.static('./public'));

app.use(users);
app.use(token);

app.use(function (req, res, next) {
  var token;
  if (req.cookie) {
    token = req.cookie.token;
  } else {
    token = req.body.token || req.query.token || req.headers['x-access-token'];
  }
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        next(boom.create(500, 'Token Validation Error'));
      }
      req.userInfo = decoded;
      console.log('user verified with info:', req.decoded);
      // res.send(true);
      next();
    });
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
});

app.use(foods);
app.use(admin);

app.get('/', (req, res, next) => {
  console.log('Hello Worlds');
});

app.post('/', (req, res, next) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log('Listening on port', port);
});

module.exports = app;
