var pg = require('pg');
var settings = "postgres://localhost/jsi-express"; // "postgres://username:password@localhost/database";
var id = process.argv[2];

if (process.argv.length <= 2) { return console.error('please provide an id to look up'); }

pg.connect(settings, function(err, client, done) {
  if (err) { return console.error('error fetching client from pool', err); }

  client.query('select * from people where id = $1::int', [id], function(err, result) {
    done();

    if (err) { return console.error('error running query', err); }
    console.log('%j', result.rows[0]);

    pg.end(); // completely finished with the database for this app
  });
});