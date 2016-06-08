var express = require('express');
var router = express.Router();

// POST: /auth/login
router.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var response = {};

  if (!email || !password) {
    return res.sendStatus(500);
  }

  var sql = 'SELECT password FROM users WHERE email=?';
  req.db.query(sql, email, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    } else if (!rows.length) {
      response.error = 'User does not exist';
      return res.send(response);
    }

    var row = rows[0];

    if (password === row.password) {
      response.success = true;
      return res.send(response);
    }

    response.error = 'Invalid username or password';
    res.send(response);
  });
});

// POST: /auth/register
router.post('/register', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var response = {};

  if (!email || !password) {
    return res.sendStatus(500);
  }

  var sql = 'SELECT id FROM users WHERE email=?';
  req.db.query(sql, email, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    } else if (rows.length) {
      response.error = 'User already exists';
      return res.send(response);
    }

    var data = {
      email: email,
      password: password
    };

    sql = 'INSERT INTO users SET ?';
    req.db.query(sql, data, function(err, result) {
      if (err) {
        return res.sendStatus(500);
      }

      response.success = true;
      res.send(response);
    });
  });
});

module.exports = router;
