var mysql = require('mysql');
var chai = require('chai');
var request = require('supertest');
var expect = chai.expect;

var app = require('../../server');
var config = require('../../config');

var db = mysql.createConnection(config.mysql);

//Login Tests
describe('auth', function() {
  before(function(done) {
    // Clear and insert dummy data into the database
    var post = [
      [1, 'hello@world1.com', 'pass@word1'],
      [2, 'hello@world2.com', 'pass@word2'],
      [3, 'hello@world3.com', 'pass@word3'],
    ];

    var sql = 'DELETE FROM users';
    db.query(sql, [post], function(err) {
      if (err) {
        done(err);
      }

      sql = 'INSERT INTO users (id, email, password) VALUES ?';
      db.query(sql, [post], function(err) {
        err ? done(err) : done();
      });
    });
  });

  after(function(done) {
    // Clear the database
    var sql = 'DELETE FROM users';
    db.query(sql, function(err) {
      err ? done(err) : done();
    });
  });

  describe('#login', function() {
    //Tests for blanks
    it('should send status 500 when sending no data', function(done) {
      request(app)
        .post('/auth/login')
        .expect(500)
        .end(function(err) {
          err ? done(err) : done();
        });
    });
    it('should send status 500 when no username provided', function(done){
      request(app)
        .post('/auth/login')
        .send({email: null, password: 'apples'})
        .expect(500)
        .end(function(err) {
            err ? done(err) : done();
        });
    });
    it('should send status 500 when no password provided', function(done){
      request(app)
        .post('/auth/login')
        .send({email: "username", password: null})
        .expect(500)
        .end(function(err) {
            err ? done(err) : done();
        });
    });


    //Invalid Username / Email
    it('should send status 200 and a error when invalid username provided', function(done){
      request(app)
        .post('/auth/login')
        .send({email: 'hello@worlds.com', password: 'apples'})
        .expect(200, '{"error":"User does not exist"}')
        .end(function(err) {
            err ? done(err) : done();
        });
    });

    //Invalid password
    it('should send status 200 and a error when wrong password provided', function(done){
      request(app)
        .post('/auth/login')
        .send({email: 'hello@world1.com', password: 'apples'})
        .expect(200, '{"error":"Invalid username or password"}')
        .end(function(err) {
            err ? done(err) : done();
        });
    });
  });
});
