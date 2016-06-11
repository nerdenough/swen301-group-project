var path = require('path');
var config = {};

config.app = {
  title: 'KPSmart'
};

config.mysql = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'vagrant',
  password: process.env.DB_PASS || 'vagrant',
  database: process.env.DB_NAME || 'vagrant',
  port: process.env.DB_PORT || 13306
};

config.log = path.join(__dirname, 'data/log.json');

module.exports = config;
