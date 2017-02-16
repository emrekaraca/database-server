var express = require('express'),
    app = express(),
    mongoose = require('mongoose');

// Set up DB connection and model
mongoose.connect('mongodb://localhost/database');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to DB!');
});

var keySchema = mongoose.Schema({
    key: String,
    value: String
});

var Key = mongoose.model('Key', keySchema);

// Route to store a key-value-pair
app.get('/set', function (req, res) {
  console.log("The entered query is: " + req.query);
  if (Object.keys(req.query).length !== 1) {
    res.end("Please enter one key-value-pair!");
  }
  else {
    var key = Object.keys(req.query)[0];
    var value = req.query[key];
    var newKey = new Key({ key: key, value: value });
    Key.count({ key: key }, function(err, result) {
      if (err) { throw err; }
      if (result !== 0) {
        res.end("The key: " + key + " is already in use!");
      }
      else {
        newKey.save(function (err) {
          if (err) { throw err; }
          res.end("Your entry was successfully saved!");
        })
      }
    })
  }
});

// Route to request a stored value
app.get('/get', function (req, res) {
  console.log("The entered query is: " + req.query);
  if (Object.keys(req.query).length !== 1) {
    res.end("Please enter one key-value-pair!");
  }
  else if (req.query.hasOwnProperty('key') === false) {
    res.end("Please enter the request in the following format: /get?key=[requested key]!")
  }
  else if (req.query.hasOwnProperty('key')) {
    console.log("requested key is: " + req.query.key);
    var requestedKey = req.query.key;
    Key.findOne({ key: requestedKey }, function (err, result) {
      if (err) { throw err; }
      console.log(result);
      res.end("The requested value for the entered key " + result.key + " is: " + result.value);
    })
  }
});

// Route to display all entries
app.get('/all', function (req, res) {
  Key.find({}, function (err, value) {
    if (err) { throw err; }
    res.end(JSON.stringify(value));
  })
});

// Route to delete all entries
app.get('/reset', function (req, res) {
  Key.find({}).remove().exec();
  res.end("All entries were deleted!")
});

app.listen(4000);
