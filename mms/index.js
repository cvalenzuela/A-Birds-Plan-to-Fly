/*
  Receive a MMS, save the image, transform it and respond to the user with a SMS
*/

// Modules
var express = require('express');
var twilio =  require('twilio');
var http = require('http');
var im = require('imagemagick')
var bodyParser = require('body-parser');
var fs = require('fs');
var request = require('request');

// Twilio Account Id's. Just to erase the image from twilio's server and save memory.
var accountSid = 'sid';
var authToken = "token";
var client = require('twilio')(accountSid, authToken);

var app =   express();
app.use(bodyParser.urlencoded({ extended: true }));

// SMS Route
app.post('/sms', function(req, res) {
    var twilio = require('twilio');
    var twiml = new twilio.TwimlResponse();
    var newImage = req.body.MediaUrl0;
    console.log("New image received!");

    /** Save the image **/
    request(newImage, {encoding: 'binary'}, function(error, response, body) {
      var photoId = getRandomInt(1000000, 100000000);

      // Write the image to the fs
      fs.writeFile('../imgs/received/birdtexture.jpg', body, 'binary', function (err) {
        // Resize the image
        im.resize({
          srcPath: "../imgs/received/birdtexture.jpg",
          dstPath: "../imgs/received/birdtexture-small.jpg",
          quality: 0.5,
          format: 'jpg',
          width: 200,
          height: 200,
          },function(err,stdout,stderr){
            console.log('resized new image!');
          });

          // Save an original version
          fs.writeFile('../imgs/received/birdtexture' + photoId + '.jpg', body, 'binary', function (err) {});
          console.log("done saving, now resizing...");

          // Erase the image from twilio
          var mediaSid = newImage.slice(128,162); // Get the mediaSid
          client.messages(req.body.SmsSid).media(mediaSid).delete(function(err, data) {
              if (err) {
                  console.log(err.status);
                  throw err.message;
              } else {
                  console.log("The new Image has been deleted successfully.");
                  console.log("=================================")
              }
          });
      });
    });

    console.log("Sending SMS back to user...")

    twiml.message(function() {
      this.body('Your feathers have been sent!');
    });
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
});

// Create Server
http.createServer(app).listen(1338, function () {
    console.log("Express server listening on port 1338");
});

//Random Number
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
