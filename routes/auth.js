var express = require('express');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var router = express.Router();

// POST: /auth/login
router.post('/login', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var response = {};

  if (!email || !password) {
    return res.sendStatus(500);
  }

  var sql = 'SELECT password FROM users WHERE email = ?';
  req.db.query(sql, email, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    } else if (!rows.length) {
      response.error = 'User does not exist';
      return res.send(response);
    }

    bcrypt.compare(password, rows[0].password, function(err, result) {
      if (err) {
        return res.sendStatus(500);
      }

      if (!result) {
        response.error = 'Invalid username or password';
        return res.send(response);
      }

      createToken(req.db, email, function(token) {
        response.success = true;
        response.token = token;
        res.send(response);
      });
    });
  });
});

// POST: /auth/register
router.post('/register', function(req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var password = req.body.password;
  var response = {};

  if (!firstname || !lastname || !email || !password) {
    return res.sendStatus(500);
  }

  var sql = 'SELECT id FROM users WHERE email = ?';
  req.db.query(sql, email, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    } else if (rows.length) {
      response.error = 'User already exists';
      return res.send(response);
    }

    bcrypt.genSalt(11, function(err, salt) {
      if (err) {
        return res.sendStatus(500);
      }

      bcrypt.hash(password, salt, function(err, hash) {
        if (err) {
          return res.sendStatus(500);
        }

        var data = {
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: hash,
          registered: new Date().getTime()
        };

        sql = 'INSERT INTO users SET ?';
        req.db.query(sql, data, function(err, result) {
          if (err) {
            return res.sendStatus(500);
          }

          createToken(req.db, email, function(token) {
            response.success = true;
            response.token = token;
            res.send(response);
          });
        });
      });
    });
  });
});

function createToken(db, email, callback) {
  var created = new Date();
  var expiry = new Date(created + 7);
  var token = crypto
    .createHash('md5')
    .update(email + ':' + created.getTime())
    .digest('hex');

  var data = {
    created: created.getTime(),
    expiry: expiry.getTime(),
    token: token
  };

  sql = 'INSERT INTO tokens SET ?';
  db.query(sql, data, function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    callback(token);
  });
}

module.exports = router;
