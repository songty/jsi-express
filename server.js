var _ = require('lodash');
var express = require('express');
var app = express();

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
  res.json({ people: _.values(people) });
});

app.post('/api/people', function(req, res) {
  var id = peopleSequence();
  var person = {
    id: id,
    name: req.param('name')
  };
  people[id] = person;
  res.json({ person: person });
});

app.put('/api/people/:id', function(req, res) {
  var person = people[req.params.id];
  person.name = req.body.name;
  res.json({ person: person });
});

app.delete('/api/people/:id', function(req, res) {
  var deleted = !!people[req.params.id];
  delete people[req.params.id];
  res.json({ status: deleted ? 'deleted' : 'ok' });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
