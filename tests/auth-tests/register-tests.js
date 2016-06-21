var mysql = require('mysql');
var chai = require('chai');
var request = require('supertest');
var expect = chai.expect;
var bcrypt = require('bcrypt-nodejs');

var app = require('../../server');
var config = require('../../config');

var db = mysql.createConnection(config.mysql);

//Register Tests
describe('auth', function() {
  describe('#register', function() {
    before(function(done) {
      var tmp = false;
      // Clear and insert dummy data into the database
      var salt = bcrypt.genSaltSync(11);
      var hash1 = bcrypt.hashSync('pass@word1', salt);
      var hash2 = bcrypt.hashSync('pass@word2', salt);
      var hash3 = bcrypt.hashSync('pass@word3', salt);
      var post = [
       [1, 'fname1','lname1','hello@world1.com', hash1, 0,0],
       [2, 'fname2','lname2','hello@world2.com', hash2, 0,0],
       [3, 'fname3','lname3','hello@world3.com', hash3, 0,0],
     ];

      var sql = 'DELETE FROM users';
      db.query(sql, [post], function(err) {
        if (err) {
          done(err);
        }

        sql = 'INSERT INTO users (id, firstname, lastname, email, password, manager, registered) VALUES ?';
        db.query(sql, [post], function(err) {
          if (err) {
            done(err);
          }
        });
      });
      done();
    });

    after(function(done) {
      // Clear the database
      var sql = 'DELETE FROM users';
      db.query(sql, function(err) {
        if (err) {
          done(err);
        }
      });
      done();
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
    it('should send status 500 when no firstname provided', function(done){
      request(app)
        .post('/auth/register')
        .send({firstname: null, lastname: 'last', email: 'username', password: 'apples'})
        .expect(500)
        .end(function(err) {
            err ? done(err) : done();
        });
    });
    it('should send status 500 when no lastname provided', function(done){
      request(app)
        .post('/auth/register')
        .send({firstname: 'first', lastname: null, email: 'username', password: 'apples'})
        .expect(500)
        .end(function(err) {
            err ? done(err) : done();
        });
    });
    it('should send status 500 when no username provided', function(done){
      request(app)
        .post('/auth/register')
        .send({firstname: 'first', lastname: 'last', email: null, password: 'apples'})
        .expect(500)
        .end(function(err) {
            err ? done(err) : done();
        });
    });
    it('should send status 500 when no password provided', function(done){
      request(app)
        .post('/auth/register')
        .send({firstname: 'first', lastname: 'last', email: 'username', password: null})
        .expect(500)
        .end(function(err) {
            err ? done(err) : done();
        });
    });

    //Create new user then confirm existence in users table
    it('should send status 200 when success in create new user', function(done){
      request(app)
        .post('/auth/register')
        .send({firstname: 'first', lastname: 'last', email: 'hello@example.com', password: '12345'})
        .expect(function(res) {
            res.body.token = 'token';
          })
        .expect({success:true, token:'token'})
        .end(function(err, result) {
          if (err) {
            done(err);
          }
          db.query('SELECT * FROM users WHERE email="hello@example.com"', function(err, rows){
            if (err){
              done(err);
            }
            expect(rows.length).to.equal(1);
        });
        done();
      });
    });

    it('should still show table having only one result with sent email', function(done){
      request(app)
        .post('/auth/register')
        .send({firstname: 'first', lastname: 'last', email: 'hello@world2.com', password: 'pass@word2'})
        .expect(200, '{"error":"User already exists"}')
        .end(function(err, res) {
          if (err) {
            done(err);
          }

          db.query('SELECT * FROM users WHERE email="hello@world2.com"', function(err, rows){
            if (err){
              done(err);
            }
              expect(rows.length).to.equal(1);
          });
          done();
        });
    });
  });

});
