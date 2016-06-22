var mysql = require('mysql');
var chai = require('chai');
var request = require('supertest');
var expect = chai.expect;

var app = require('../../server');
var config = require('../../config');

var db = mysql.createConnection(config.mysql);

describe('routes', function(){
  before(function(done){
    var cities = [
        [1, 'Wellington'],
        [2, 'Auckland']
    ];
    var companies = [
      [1, 'company_A', 1],
      [2, 'company_B', 2],
      [3, 'company_C', 1],
    ];
    var routes = [
      [1,1,2,1,10,20,10,10,1,1],
      [2,2,1,3,50,60,30,20,0,0]
    ];
    var tokens = [
      [1, 1, 'abc', 0,5000],
      [2, 2, 'xyz', 0,1]
    ];

    var sql = 'DELETE FROM tokens';
    db.query(sql, [tokens], function(err) {
      if (err) {
        done(err);
      }

      sql = 'INSERT INTO tokens (id, user_id, token, created, expiry) VALUES ?';
      db.query(sql, [tokens], function(err) {
        if (err) {
          done(err);
        }
      });
    });
    //Clear cities table
    sql = 'DELETE FROM cities';
    db.query(sql, [cities], function(err) {
      if (err) {
        done(err);
      }

      sql = 'INSERT INTO cities (id, name) VALUES ?';
      db.query(sql, [cities], function(err) {
        if (err) {
          done(err);
        }
      });
    });

    //Clear companies table
    sql = 'DELETE FROM companies';
    db.query(sql, [companies], function(err) {
      if (err) {
        done(err);
      }

      sql = 'INSERT INTO companies (id, name, city) VALUES ?';
      db.query(sql, [companies], function(err) {
        if (err) {
          done(err);
        }
      });
    });

    sql = 'DELETE FROM routes';
    db.query(sql, [routes], function(err) {
      if (err) {
        done(err);
      }

      sql = 'INSERT INTO routes (id, origin, destination, company,\
             cost, price, max_weight, max_volume, route_type, status) VALUES ?';
      db.query(sql, [routes], function(err) {
        if (err) {
          done(err);
        }
      });
    });
    done();
  });

  after(function(done){
    //Clear cities table
    db.query('DELETE FROM cities', function(err) {
      if (err) {
        done(err);
      }
    });
    db.query('DELETE FROM companies', function(err) {
      if (err) {
        done(err);
      }
    });
    db.query('DELETE FROM routes', function(err) {
      if (err) {
        done(err);
      }
    });
    db.query('DELETE FROM tokens', function(err) {
      if (err) {
        done(err);
      }
    });
    done();
  });

  describe('#PriceUpdate', function(){
    it('should send status 500 when sending no data', function(done){
      request(app)
        .post('/route/price/update')
        .expect(500)
        .end(function(err){
          err ? done(err) : done();
        });
    });
    it('should send status 500 when sending no id', function(done){
      request(app)
        .post('/route/price/update')
        .send({id:null,price:0,token:'abc'})
        .expect(500)
        .end(function(err){
          err ? done(err) : done();
        });
    });
    it('should send status 500 when sending no price', function(done){
      request(app)
        .post('/route/price/update')
        .send({id:1,price:null,token:'abc'})
        .expect(500)
        .end(function(err){
          err ? done(err) : done();
        });
    });
    it('should send status 500 when sending no token', function(done){
      request(app)
        .post('/route/price/update')
        .send({id:1,price:0,token:null})
        .expect(500)
        .end(function(err){
          err ? done(err) : done();
        });
    });

    it('should send status 200 with error when sending invalid price', function(done){
      request(app)
        .post('/route/price/update')
        .send({id:1,price:'a',token:'abc'})
        .expect(200, '{"error":"Price must be a number"}')
        .end(function(err){
          err ? done(err) : done();
        });
    });
    it('should send status 200 with error when sending invalid token', function(done){
      request(app)
        .post('/route/price/update')
        .send({id:1,price:1,token:'123'})
        .expect(200, '{"error":"Unauthorized user"}')
        .end(function(err){
          err ? done(err) : done();
        });
    });

    it('should update existing routes Price', function(done){
    request(app)
        .post('/route/price/update')
        .send({id:1,price:300,token:'abc'})
        .expect({success:true})
        .end(function(err){
          if (err) {
            done(err);
          }
          db.query('SELECT * FROM routes WHERE id = 1', function(err, rows){
            if (err) {
              done(err);
            }
            expect(rows[0].price).to.equal(300);
            done();
          });
        });
    });
  });
});
