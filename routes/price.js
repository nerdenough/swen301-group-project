var express = require('express');
var router = express.Router();

// POST: /price/update
router.post('/update', function(req, res) {
  var id = req.body.id;
  var price = req.body.price;
  var token = req.body.token;
  var response = {};

  if (!id || !price || !token) {
    return res.sendStatus(500);
  }

  // TODO: Check user token
  // TODO: Check route exists

  if (isNaN(price)) {
    response.error = 'NaN';
    return res.send(response);
  }

  // TODO: Update route in database

  res.send(response);
});

module.exports = router;
