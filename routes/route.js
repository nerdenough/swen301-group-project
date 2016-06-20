var express = require('express');
var router = express.Router();

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

module.exports = router;
