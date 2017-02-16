var express = require('express'),
    app = express(),
    LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

// Route to store a key-value-pair
app.get('/set', function (req, res) {
  console.log("The entered query is: " + req.query);
  if (Object.keys(req.query).length !== 1) {
    res.end("Please enter one key-value-pair!");
  }
  else {
    var key = Object.keys(req.query)[0];
    var value = req.query[key];
    localStorage.setItem(key, value);
    console.log("stored key: " + localStorage.getItem(key));
    res.end("Your entry was successfully saved!\nKey: " + key +"\n" + "Value: " + value);
  }
});

// Route to request a stored value
app.get('/get', function (req, res) {
  console.log("The entered query is: " + req.query);
  if (Object.keys(req.query).length !== 1 || req.query.hasOwnProperty('key') === false) {
    res.end("Please enter the request in the following format: /get?key=[requested key]!")
  }
  else if (req.query.hasOwnProperty('key')) {
    console.log("requested key is: " + req.query.key);
    var requestedKey = req.query.key;
    if (localStorage.getItem(requestedKey) !== null) {
      res.end("The requested value for the entered key \'" + requestedKey + "\' is: \'" + localStorage.getItem(requestedKey) + "\'.");
    } else {
      res.end("The key \'" + requestedKey + "\' was not found!")
    }
  }
});

// Route to reset storage
app.get('/reset', function(req, res) {
  localStorage.clear();
  res.end("All entries were deleted!")
})

app.listen(4000, function() {
  console.log("Up and running on 4000...");
});
