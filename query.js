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

var findPerson = module.exports.findPerson =function(id) {
	return People.where({ id: id }).fetch();
};

var updatePerson = module.exports.updatePerson =function(update, person) {
	// var target = person;
	person.set({name: update});
	return person.save();
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
