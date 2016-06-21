var express = require('express');
var router = express.Router();

// POST: /route/create
router.post('/create', function(req, res) {
  var origin = req.body.origin;
  var destination = req.body.destination;
  var company = req.body.company;
  var cost = req.body.cost;
  var price = req.body.price;
  var maxWeight = req.body.maxWeight;
  var maxVolume = req.body.maxVolume;
  var type = req.body.type;
  var response = {};

  if (!origin || !destination || !company || !cost
      || !price || !maxWeight || !maxVolume || !type) {
    return res.sendStatus(500);
  }

  var data = {
    origin: origin,
    destination: destination,
    company: company,
    cost: cost,
    price: price,
    'max_weight': maxWeight,
    'max_volume': maxVolume,
    'route_type': type
  };

  var sql = 'SELECT * FROM routes WHERE origin = ? AND destination = ? AND company = ?';
  req.db.query(sql, [origin, destination, company], function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    if (rows.length) {
      sql = 'UPDATE routes SET cost = ?, price = ? WHERE id = ?';
      req.db.query(sql, [cost, price, rows[0].id], function(err, result) {
        if (err) {
          return res.sendStatus(500);
        }

        response.success = true;
        res.send(response);
      });
    } else {
      sql = 'INSERT INTO routes SET ?';
      req.db.query(sql, data, function(err, result) {
        if (err) {
          return res.sendStatus(500);
        }

        response.success = true;
        res.send(response);
      });
    }
  });
});

// GET: /route/list
router.get('/list', function(req, res) {
  var sql = 'SELECT * FROM routes';
  req.db.query(sql, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    res.send(rows);
  });
});

module.exports = router;
