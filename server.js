var _ = require('lodash');
var express = require('express');
var app = express();
var query = require('./query');

app.use(require('morgan')('dev'));
app.use(require('body-parser')());
app.use(require('method-override')('_method'));
app.use(express.static(__dirname + '/public'));

var people = {};
var peopleSequence = (function() {
  var sequence = 1;
  return function() {
    var result = sequence;
    sequence += 1;
    return result;
  };
}());

app.get('/', function(req, res) {
  res.redirect('/home/');
});

app.get('/api/people', function(req, res) {
  query.fetchPeople().then(function(person) {
    res.json({ person: person.toJSON() });
  });
});

app.get('/api/people/:id', function(req, res) {
  query.findPerson(req.params.id).then(function(person) {
    res.json({ person: person.toJSON() });
  });
});

app.post('/api/people', function(req, res) {
  query.createNewPerson(req.param('name')).then(function(person){
	  res.json({ person: person });
  }).done();

});

app.put('/api/people/:id', function(req, res) {
  query.findPerson(req.params.id).then(function(person) {
    query.updatePerson(req.param('name'), person).then(function(person) {
      res.json({ person: person});
    });
  }).done();
});

app.delete('/api/people/:id', function(req, res) {
  var deleted = !!people[req.params.id];
  delete people[req.params.id];
  res.json({ status: deleted ? 'deleted' : 'ok' });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});