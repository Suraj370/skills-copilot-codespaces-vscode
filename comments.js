// Create web server
// 1. Create a web server, listening on port 3000
// 2. When a request comes in, read in the comments file
// 3. Add the new comment to the array
// 4. Write the new array back to the file
// 5. Redirect the user back to the home page

// Load in the modules
var http = require('http');
var fs = require('fs');
var url = require('url');

// Load in the data file
var comments = require('./comments.json');

// Create the server
var server = http.createServer(function(req, res) {

  // Get the URL
  var path = url.parse(req.url).pathname;

  // If it's a GET request to /comments, return the comments array
  if (req.method === 'GET' && path === '/comments') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(comments));

  // If it's a POST request to /comments, add the comment to the array
  } else if (req.method === 'POST' && path === '/comments') {

    // Create a string to hold the incoming data
    var data = '';

    // When data is received, add it to the string
    req.on('data', function(chunk) {
      data += chunk;
    });

    // When the request has ended
    req.on('end', function() {

      // Parse the string into an object
      var newComment = JSON.parse(data);

      // Add the new comment to the array
      comments.push(newComment);

      // Write the array back to the file
      fs.writeFile('./comments.json', JSON.stringify(comments), function(err) {
        if (err) {
          console.log(err);
        }
      });

      // Send back a response
      res.writeHead(201, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify(newComment));
    });

  // Otherwise, serve the file
  } else {
    fs.readFile('./index.html', function(err, file) {
      if (err) {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end(err);
      } else {
        res.writeHead(200, {
          '