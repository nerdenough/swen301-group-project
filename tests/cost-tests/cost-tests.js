var mysql = require('mysql');
var chai = require('chai');
var request = require('supertest');
var expect = chai.expect;
var bcrypt = require('bcrypt-nodejs');

var app = require('../../server');
var config = require('../../config');

var db = mysql.createConnection(config.mysql);

//Volume and Weight Tests
describe('delivery', function() {
	before(function(done) {
		var routes = [
			[1, 1, 2, 2, 16.00, 20.00, 10.0000, 10.0000, 0, 1],
			[2, 2, 1, 1, 13.99, 20.00, 20.0000, 20.0000, 2, 1]
		];
		
		var sql = 'DELETE FROM routes';
		db.query(sql, [routes], function(err) {
			if (err) {
        		done(err);
     		}
     		
     		sql = 'INSERT INTO routes (id, origin, destination, company, cost, price, max_weight, max_volume, route_type, status) VALUES ?';
     		db.query(sql, [routes], function(err) {
        		if (err) {
          			done(err);
        		}
      		});
		});
		done();
	});
	
	after(function(done) {
		// Clear the database
    	var sql = 'DELETE FROM routes';
    	db.query(sql, function(err) {
      		err ? done(err) : done();
    	});
	});
	
	describe('#create', function() {
		//Test for blanks
		it('should send 500 when volume is empty', function(done) {
			request(app)
				.post('delivery/create')
				.send({id: 1, sender: 1, recipient: 2, cost: 23.00, price: 30.00, weight: 5.0000, volume: null, origin: 1, destination: 2, route: 1, time: 1466473960})
				.expect(500)
				.end(function(err) {
            		err ? done(err) : done();
        		});
		});
		
		it('should send 500 when weight is empty', function(done) {
			request(app)
				.post('delivery/create')
				.send({id: 1, sender: 1, recipient: 2, cost: 23.00, price: 30.00, weight: null, volume: 5.0000, origin: 1, destination: 2, route: 1, time: 1466473960})
				.expect(500)
				.end(function(err) {
            		err ? done(err) : done();
        		});
		});
		
		it('should send 500 when weight is over max_value)', function(done) {
			request(app)
				.post('delivery/create')
				.send({id: 1, sender: 1, recipient: 2, cost: 23.00, price: 30.00, weight: 50.0000, volume: 5.0000, origin: 1, destination: 2, route: 1, time: 1466473960})
				.expect(500)
				.end(function(err) {
            		err ? done(err) : done();
        		});
		});
		
		it('should send 500 when volume is over max_value)', function(done) {
			request(app)
				.post('delivery/create')
				.send({id: 1, sender: 1, recipient: 2, cost: 23.00, price: 30.00, weight: 5.0000, volume: 50.0000, origin: 1, destination: 2, route: 1, time: 1466473960})
				.expect(500)
				.end(function(err) {
            		err ? done(err) : done();
        		});
		});
		
	});
});
