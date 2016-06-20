var fs = require('fs');

function readLog(file, callback) {
  fs.readFile(file, callback);
}

function writeLog(file, data, callback) {
  var json = JSON.stringify(data);
  fs.writeFile(file, json, callback);
}

module.exports = {
  readLog: readLog,
  writeLog: writeLog
};
