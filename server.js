var _ = require('lodash');
var express = require('express');
var app = express();
var query = require('./query');
var bluebird = require('bluebird'), Promise = bluebird;
var pg = bluebird.promisifyAll(require('pg'));

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
  query.findPerson(req.params.id).then(function(person) {
    query.killPerson(person).then(function(person) {
        res.json({ status: person ? 'deleted' : 'ok' });
    });
  }).done();
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});

if (require.main === module) {
  var settings = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    dbURL: process.env.DATABASE_URL ||
      'postgres://localhost/jsi-express'
  };

  pg.connectAsync(settings.dbURL).spread(function(client, done) {
    createApp(settings, bluebird.promisifyAll(client))
    .listen(settings.port, function() {
      console.log('Express server started on port %s', settings.port);
    });
  })
  .catch(function(e) {
    console.log(e);
    console.error('Could not connect to database: %s', settings.dbURL);
    process.exit(1);
  });
}