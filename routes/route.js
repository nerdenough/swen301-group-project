var express = require('express');
var router = express.Router();

// POST: /route/create
router.post('/create', function(req, res) {
  var origin = req.body.origin;
  var destination = req.body.origin;
  var company = req.body.company;
  var cost = req.body.cost;
  var price = req.body.cost;
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

  var sql = 'INSERT INTO routes SET ?';
  req.db.query(sql, data, function(err, result) {
    if (err) {
      res.sendStatus(500);
    }

    response.success = true;
    res.send(response);
  });
});

// POST: /route/price/update
router.post('/price/update', function(req, res) {
  var id = req.body.id;
  var price = req.body.price;
  var token = req.body.token;
  var response = {};

  if (!id || !price || !token) {
    return res.sendStatus(500);
  }

  if (isNaN(price)) {
    response.error = 'Price must be a number';
    return res.send(response);
  }

  var sql = 'SELECT token FROM tokens WHERE token = ?';
  req.db.query(sql, token, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    if (rows.length !== 1) {
      response.error = 'Unauthorized user';
      return res.send(response);
    }

    sql = 'SELECT id FROM routes WHERE id = ?';
    req.db.query(sql, id, function(err, rows) {
      if (err) {
        return res.sendStatus(500);
      }

      if (rows.length !== 1) {
        response.error = 'Route does not exist';
        return res.send(response);
      }

      sql = 'UPDATE routes SET price = ? WHERE id = ?';
      req.db.query(sql, [price, id], function(err, results) {
        if (err) {
          return res.sendStatus(500);
        }

        response.success = true;
        res.send(response);
      });
    });
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
