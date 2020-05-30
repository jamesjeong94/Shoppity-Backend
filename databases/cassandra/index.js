const cassandra = require('cassandra-driver');
const tables = require('./initTables.js');
const datatypes = require('./initDatatypes.js');
const distance = cassandra.types.distance;

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'sdc',
  pooling: {
    coreConnectionsPerHost: {
      [distance.local]: 2,
      [distance.remote]: 1,
    },
    maxRequestsPerConnection: 32768,
  },
});

client.connect((err) => {
  if (err) {
    console.log(err);
  }
  console.log('==>Successfully connected to database');
  console.log('==>Initializing datatypes...');
  handleInit(datatypes, 'datatype');
  console.log('==>Initializing tables...');
  handleInit(tables, 'table');
});

const handleInit = (init, type) => {
  for (let key in init) {
    client
      .execute(init[key])
      .then(() => {
        console.log(`${key} ${type}  has been initialized`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

module.exports = client;
