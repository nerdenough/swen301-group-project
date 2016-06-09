var mysql = require('mysql');
var chai = require('chai');
var request = require('supertest');
var expect = chai.expect;

var app = require('../../server');
var config = require('../../config');

var db = mysql.createConnection(config.mysql);

//Register Tests
describe('auth', function() {
  describe('#register', function() {
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


    //Test for blanks
    it('should send status 500 when sending no data', function(done) {
      request(app)
        .post('/auth/register')
        .expect(500)
        .end(function(err) {
          err ? done(err) : done();
        });
    });

    //Create new user then confirm existence in users table
    it('should send status 200 when success in create new user', function(done){
      request(app)
        .post('/auth/register')
        .send({email: 'hello@example.com', password: '12345'})
        .expect(200)
        .end(function(err) {
          if (err) {
            done(err);
          }
          db.query('SELECT * FROM users WHERE email="hello@example.com"', function(err, rows){
            if (err){
              done(err);
            }
            expect(rows.length).to.equal(1);
          done();
        });
      });
    });

    it('should still show table having only one result with sent email', function(done){
      request(app)
        .post('/auth/register')
        .send({email: 'hello@world2.com', password: 'pass@word2'})
        .end(function(err) {
          if (err) {
            done(err);
          }
          db.query('SELECT * FROM users WHERE email="hello@world2.com"', function(err, rows){
            if (err){
              done(err);
            }
            expect(rows.length).to.equal(1);
          done();
          });
        });
    });
  });

});
