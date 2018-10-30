const Kafka = require('node-rdkafka');
var stringify = require('json-stringify');


var producer = new Kafka.Producer({
  'client.id': 'kafka',
  'metadata.broker.list': '127.0.0.1:9092',
  'compression.codec': 'gzip',
  'retry.backoff.ms': 200,
  'message.send.max.retries': 10,
  'socket.keepalive.enable': true,
  'queue.buffering.max.messages': 100000,
  'queue.buffering.max.ms': 1000,
  'batch.num.messages': 1000000,
  'dr_cb': true
});

process.on('uncaughtException', function (err) {
    console.log(err);
});

var stream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': '127.0.0.1:9092'
}, {}, {
  topic: 'price.changed'

});

// Writes a message to the stream
var message = JSON.stringify({"location_id": "1000", "price": "1000"});
var queuedSuccess = stream.write(new Buffer(message));

if (queuedSuccess) {
  console.log('We queued our message!');
} else {
  // Note that this only tells us if the stream's queue is full,
  // it does NOT tell us if the message got to Kafka!  See below...
  console.log('Too many messages in our queue already');
}

stream.on('error', function (err) {
  // Here's where we'll know if something went wrong sending to Kafka
  console.error('Error in our kafka stream');
  console.error(err);
})
