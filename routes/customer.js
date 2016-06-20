var express = require('express');
var router = express.Router();

// POST: /customer/create
router.post('/create', function(req, res) {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var address = req.body.address;
  var response = {};

  if (!firstname || !lastname || !email || !address) {
    return res.sendStatus(500);
  }

  var data = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    address: address
  };
  var sql = 'INSERT INTO customers SET ?';
  req.db.query(sql, data, function(err, result) {
    if (err) {
      res.sendStatus(500);
    }

    response.success = true;
    res.send(response);
  });
});

// GET: /customer/list
router.get('/list', function(req, res) {
  var sql = 'SELECT * FROM customers';
  req.db.query(sql, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    res.send(rows);
  });
});

module.exports = router;
