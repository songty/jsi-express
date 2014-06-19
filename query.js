var env = process.env.NODE_ENV || 'development';
var knexConfig = require('./knexfile.js')[env];
var knex = require('knex')(knexConfig);
var bookshelf = require('bookshelf')(knex);

var People = bookshelf.Model.extend({
  tableName: 'people'
});

var createNewPerson = module.exports.createNewPerson =function(inputName) {
	return People.forge({ name: inputName }).save();
};

var fetchPeople = module.exports.fetchPeople = function() {
	return People.fetchAll();
};

var finish = module.exports.finish = function() {
	bookshelf.knex.client.pool.destroy();
};

var findPeople = module.exports.findPeople =function() {
	return People.where({ id: process.argv[2] }).fetchAll();
};

var updatePeople = module.exports.updatePeople =function(people) {
	var target = people.at(0);
	target.set({name: process.argv[3]});
	return target.save();
};

var killPeople = module.exports.killPeople =function(people) {
	var target = people.at(0);
	console.log('Person destroyed %j', people.toJSON());
	return target.destroy();
};
// Updates
// findPeople().then(updatePeople).then(fetchPeople).then(finish).done();
// Creates
// createNewPerson().then(fetchPeople).then(finish).done();
// Deletes 
// findPeople().then(killPeople).then(fetchPeople).then(finish).done();
