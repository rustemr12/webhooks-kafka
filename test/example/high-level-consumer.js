'use strict';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/webhooks');
var request = require('request');
var Schema = mongoose.Schema;
// create a schema
var webhookSchema = new Schema({

 url: { type: String, required: true, unique: true },
 status: { type: String, required: true },
 events: {type: Array, required : true},
 created_at: Date,
 updated_at: Date
});

var Webhook = mongoose.model('Webhook', webhookSchema);



var kafka = require('..');
var HighLevelConsumer = kafka.HighLevelConsumer;
var Client = kafka.Client;
var argv = require('optimist').argv;
var topic = argv.topic || 'price.changed';
var client = new Client('localhost:2181');
var topics = [{ topic: topic }];
var options = { autoCommit: true, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };
var consumer = new HighLevelConsumer(client, topics, options);

consumer.on('message', function (message) {
  console.log(message);
  console.log(message.topic)
  Webhook.find({ 'events': message.topic }, function (err, webhook) {
    if (err) return handleError(err);
    if (!err){
        var json_message = message.value;
        console.log(json_message)
        request.post({
            headers: {'content-type' : 'application/json'},
            url: webhook[0].url,
            body: json_message
          }, function(error, response, body){
              console.log(body);
        });

      //  request({ url: webhook[0].url, json: true, body: json_message, method: 'post' }, function (error, response, body) {

          //console.log('error:', error); // Print the error if one occurred
          //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          //console.log('body:', body); // Print the HTML for the Google homepage.
        //});
    }


});


});

consumer.on('error', function (err) {
  console.log('error', err);
});
