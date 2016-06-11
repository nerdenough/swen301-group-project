var express = require('express');
var router = express.Router();

var helpers = require('../helpers/log-helpers');

// GET: /data/log
router.get('/log', function data(req, res) {
  helpers.readLog(req.config.log, function(err, data) {
    if (err) {
      return res.sendStatus(500);
    }

    res.send(JSON.parse(data));
  });
});

module.exports = router;
