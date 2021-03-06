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
    }

    if (rows.length) {
      response.error = 'User already exists';
      return res.send(response);
    }

    var salt = bcrypt.genSaltSync(11);
    var hash = bcrypt.hashSync(password, salt);

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

// POST: /auth/validate
router.post('/validate', function(req, res) {
  var token = req.body.token;
  var response = {};

  var sql = 'SELECT expiry FROM tokens WHERE token = ?';
  req.db.query(sql, token, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    if (!rows.length) {
      response.error = 'Unauthorized';
      return res.send(response);
    }

    if (new Date().getTime() > rows[0].expiry) {
      response.error = 'Token expired';
      return res.send(response);
    }

    response.success = true;
    res.send(response);
  });
});

function createToken(db, email, callback) {
  var created = new Date().getTime();
  var expiry = created + (7 * 1000 * 24 * 60 * 60);
  var token = crypto
    .createHash('md5')
    .update(email + ':' + created)
    .digest('hex');

  var sql = 'SELECT id FROM users WHERE email = ?';
  db.query(sql, email, function(err, rows) {
    if (err || !rows.length) {
      return res.sendStatus(500);
    }

    var data = {
      'user_id': rows[0].id,
      created: created,
      expiry: expiry,
      token: token
    };

    sql = 'INSERT INTO tokens SET ?';
    db.query(sql, data, function(err, result) {
      if (err) {
        return res.sendStatus(500);
      }

      callback(token);
    });
  });
}

module.exports = router;
