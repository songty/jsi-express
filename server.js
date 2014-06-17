var express = require('express');
var _ = require('lodash');
var app = express();

app.use(require('morgan')('dev'));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

var match;
var people = {  
	1: { id: 1, name: 'Adam' },
  2: { id: 2, name: 'Ariel' },
  3: { id: 3, name: 'Sam' },
  4: { id: 4, name: 'Grant' }
};

app.get('/', function(req, res) {
	res.redirect('/home/');
});

app.get('/api/people', function(req, res) {
	res.json(people);
});

app.get(/^\/api\/people\/(\d+)$/, function(req, res) {
	(match = req.url.match(/^\/api\/people\/(\d+)$/));
	var id = match[1];
	var person = people[id];
	if (person) {
		res.json(person);
	} else {
		res.send(404, 'Sorry, that person does not exist.');
	}
});

app.post('/api/people', function(req, res) {
  var id = _.size(people) + 1;
  var person = {
    id: id,
    name: req.param('name')
  };
  people[id] = person;
  res.json({ person: person });
});

app.put(/^\/api\/people\/(\d+)$/, function(req, res) {
	(match = req.url.match(/^\/api\/people\/(\d+)$/));
	var id = match[1];
	var person = people[id];
	var newPerson = {
		id: id,
		name: req.param('name')
	};
	people[id] = newPerson;
	if (person) {
		res.json(newPerson);
	} else {
		res.send(404, 'Sorry, that person does not exist.');
	}
});

app.delete(/^\/api\/people\/(\d+)$/, function(req, res) {
	(match = req.url.match(/^\/api\/people\/(\d+)$/));
	var id = match[1];
	var person = people[id];
	if (person) {
		delete people[id];
		res.send('Elvis has left the building.');
	} else {
		res.send(404, 'Sorry, that person does not exist.');
	}
});

var server = app.listen(process.env.PORT || 3030, function() {
  console.log('Listening on port %d', server.address().port);
});
