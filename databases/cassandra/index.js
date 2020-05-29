const cassandra = require('cassandra-driver');
const init = require('./init.js');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'grocery',
});

client.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log('success');
});

const handleInit = (init) => {
  for (let key in init) {
    client
      .execute(init[key])
      .then(() => {
        console.log(`${key} table has been initialized`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

handleInit(init);
