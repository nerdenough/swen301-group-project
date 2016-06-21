var express = require('express');
var router = express.Router();

// POST: /company/create
router.post('/create', function(req, res) {
  var name = req.body.name;
  var city = req.body.city;
  var response = {};

  if (!name || !city) {
    return res.sendStatus(500);
  }

  var sql = 'SELECT id FROM cities WHERE id = ?';
  req.db.query(sql, city, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    if (!rows.length) {
      response.error = 'Invalid city';
      return res.send(response);
    }

    var data = {
      name: name,
      city: city
    };
    sql = 'INSERT INTO companies SET ?';
    req.db.query(sql, data, function(err, result) {
      if (err) {
        res.sendStatus(500);
      }

      response.success = true;
      res.send(response);
    });
  });
});

// GET: /company/list
router.get('/list', function(req, res) {
  var sql = 'SELECT * FROM companies';
  req.db.query(sql, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    res.send(rows);
  });
});

module.exports = router;
