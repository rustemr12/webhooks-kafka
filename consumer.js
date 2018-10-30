const kafka = require('node-rdkafka');

const topic = 'topic';
const connection = 'localhost:9092';
const groupId = 'kafka';
const handler = (data) => {
  console.log('got data', data);
//  throw new Error('HELLO');
};
const stream = kafka.createReadStream(
  { 'metadata.broker.list': connection, 'group.id': groupId, event_cb: true },
  {},
  {
    topics: [topic]
  }
);

stream.on('data', handler);

stream.on('error', err => console.log({ ERROR: err }));
stream.on('event.err', err => console.log({ errl: err }));
