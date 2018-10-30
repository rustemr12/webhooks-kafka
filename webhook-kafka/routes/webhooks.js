var express = require('express');
var mongoose = require('mongoose');
const Webhook = require('../models/webhook');
const schemas = require('../models/schemas');
var Ajv = require('ajv');





var router = express.Router();

/* GET webhooks listing. */
router.get('/webhooks', function(req, res, next) {

    // the schema is useless so far
    // we need to create a model using it
    //Webhook = mongoose.model('Webhook', webhookSchema);
    Webhook.find({},'-_id status url events', function(err, webhooks) {
        if (err) throw err;
        // object of all the users

        var webhook_list = {"webhooks": webhooks};
        var response = JSON.stringify(webhook_list);

        res.setHeader("content-type", "application/json");
        //form the response

        res.send(response);
    });
  //  console.log(Webhook)



});

router.post('/webhooks', function(req, res, next) {

    //schema validation
    var ajv = new Ajv({$data: true});
    var result = ajv.validate(schemas['create_webhook'], req);

    if (result == true) {
        var webhook = new Webhook({
          url: req.body.url,
          status: 'ACTIVE',
          created_at: new Date(),
          events: req.body.events
        });
        console.log(webhook)
        // call the built-in save method to save to the database
        webhook.save(function(err) {
          if (err) {
              ///var failure_code  = err['code']
              if (err.code == 11000){
                var error_description = {"error_description": "Duplicate URL"};
                res.send(error_description);
              }

          }
          else {
            res.send(webhook);
          }

        });
  }
  else{

    //schema validation failed
    res.setHeader("content-type", "application/json");
    res.status(400);

    var error_response = [];
  //  error_response['error_code'] = '400-005';
  //  error_response['error_code'] = '400-005';
    console.log(ajv.errors)
    res.send(ajv.errors);
  }

});

module.exports = router;
