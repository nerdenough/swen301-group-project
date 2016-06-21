var express = require('express');
var router = express.Router();

// POST: /delivery/create
router.post('/create', function data(req, res) {
  var sender = req.body.sender;
  var recipient = req.body.recipient;
  var cost = req.body.cost;
  var price = req.body.cost;
  var weight = req.body.weight;
  var volume = req.body.volume;
  var origin = req.body.origin;
  var destination = req.body.destination;
  var route = req.body.route;
  var priority = req.body.priority;
  var duration = req.body.duration;
  var response = {};

  if (!sender || !recipient || !cost || !price || !weight || !priority
      || !volume || !origin || !destination || !route || !duration) {
    return res.sendStatus(500);
  }

  var data = {
    sender: sender,
    recipient: recipient,
    cost: cost,
    price: price,
    weight: weight,
    volume: volume,
    origin: origin,
    destination: destination,
    route: route,
    priority: priority,
    duration: duration,
    time: new Date().getTime()
  };
  var sql = 'INSERT INTO deliveries SET ?';
  req.db.query(sql, data, function(err, result) {
    if (err) {
      return res.sendStatus(500);
    }

    response.success = true;
    res.send(response);
  });
});

// GET: /delivery/list
router.get('/list', function(req, res) {
  var sql = 'SELECT * FROM deliveries';
  req.db.query(sql, function(err, rows) {
    if (err) {
      return res.sendStatus(500);
    }

    res.send(rows);
  });
});


module.exports = router;
