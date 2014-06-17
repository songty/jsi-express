var express = require('express');
var app = express();

app.use(require('morgan')('dev'));
app.use(require('body-parser')());
app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));


var people = {};

app.post('/api/people', function(req, res) {
  var id = people.length + 1;
  var person = {
    id: 1,
    name: req.param('name')
  };
  people[id] = person;
  res.json({ person: person });
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
