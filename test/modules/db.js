var chai = require('chai'),
	expect = chai.expect,
	conf = require('../../lib/conf'),
	db = require('../../lib/modules/db');

describe('Database', function() {
	var mySQL, testDB, opts;
	before(function() {
		opts = global.$config.db.base;
		mySQL = new db.Database(opts);
		testDB = new db.Database(Object.assign({database: 'testDB'}, opts));
	});
	describe('#connect()', function() {
		it('should connect to MySQL', function() {
			return mySQL.connect()
			.catch(function(err) {
				expect.fail(err, undefined);
			});
		});
	});
	describe('#query()', function () {
		it('should create a database', function() {
			return mySQL.query('CREATE DATABASE testDB')
			.catch(function(err) {
				expect.fail(err, undefined);
			});
		});

		it('should switch to that database', function() {
			return testDB.connect()
			.catch(function(err) {
				expect.fail(err, undefined);
			});
		});
		it('should create a table', function() {
			return testDB.query('CREATE TABLE test (id INT, data VARCHAR(10))')
			.catch(function(err) {
				expect.fail(err, undefined);
			});
		});
		it('should populate a table', function() {
			return testDB.query(`INSERT INTO test VALUES ('1', 'tester')`)
			.catch(function(err) {
				expect.fail(err, undefined);
			});
		});
		it('should get data from a table', function() {
			return testDB.query('SELECT id, data FROM test').then
			(function(res) {
				var data = res[0];
				expect(data.id).to.equal(1);
				expect(data.data).to.equal('tester');
			}).catch(function(err) {
				expect.fail(err, undefined);
			});
		});
		it('should remove a table', function() {
			testDB.query('DROP TABLE test')
			.catch(function(err) {
				expect.fail(err, undefined);
			});
		});
		it('should remove a database', function() {
			return testDB.query('DROP DATABASE testDB')
			.catch(function(err) {
				expect.fail(err, undefined);
			});
		});
	});
	describe('#disconnect()', function () {
		it('should disconnect from MySQL', function() {
			return testDB.disconnect()
			.then(function() {
				return mySQL.disconnect();
			})
			.catch(function(err) {
				expect.fail(err, undefined);
			});
		});
		it('should not be able to query', function() {
			return testDB.query('CREATE DATABASE testDB')
			.then(function() {
				expect.fail();
			}).catch(function(err) {
				expect(err).to.be.ok;
			})
		})
	});
});