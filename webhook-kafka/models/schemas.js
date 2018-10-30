var Ajv = require('ajv');

var create_webhook = {
"properties": {
  "url": {
    "minLength": 1,
    "maxLength": 10,
    "type": "string"
  },
  "events": {
     "type": "array",
     "uniqueItems": true,
     "maxItems": 3,
     "minItems": 1

   }
},
  "required": ["url"]
}

var schemas = [];
schemas['create_webhook'] = create_webhook

module.exports = schemas;
