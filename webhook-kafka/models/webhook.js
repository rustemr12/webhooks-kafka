// mongo schemas

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/webhooks');
var Schema = mongoose.Schema;

// create a schema
var webhookSchema = new Schema({

 url: { type: String, required: true, unique: true },
 status: { type: String, required: true },
 events: {type: Array, required : true},
 created_at: Date,
 updated_at: Date,
 created_by: {type: String}
});

var Webhook = mongoose.model('Webhook', webhookSchema);

// make this available to our users in our Node applications
module.exports = Webhook;
