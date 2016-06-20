var express = require('express');
var router = express.Router();

// POST: /city/create
router.post('/create', function(req, res) {
  var name = req.body.name;
  var response = {};

  if (!name) {
    return res.sendStatus(500);
  }

  var data = {
    name: name
  };
  var sql = 'INSERT INTO cities SET ?';
  req.db.query(sql, data, function(err, result) {
    if (err) {
      res.sendStatus(500);
    }

    response.success = true;
    res.send(response);
  });
});

// GET: /city/list
router.get('/list', function(req, res) {
  var sql = 'SELECT * FROM cities';
  req.db.query(sql, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    res.send(rows);
  });
});

module.exports = router;
