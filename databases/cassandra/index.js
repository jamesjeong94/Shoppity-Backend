const cassandra = require('cassandra-driver');
const tables = require('./initTables.js');
const datatypes = require('./initDatatypes.js');
const distance = cassandra.types.distance;

const host = process.env.CASSANDRA_SERVER || '127.0.0.1';
console.log('HOST:', host);

const client = new cassandra.Client({
  contactPoints: [host],
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
  if (err) console.log(err);
  console.log('==>Successfully connected to database');
  const initKeyspaceQuery = `CREATE KEYSPACE IF NOT EXISTS sdc
  WITH REPLICATION = { 
   'class' : 'SimpleStrategy', 
   'replication_factor' : 1 
  };`;
  client.execute(initKeyspaceQuery, [], (err) => {
    if (err) console.log(err);
    console.log('==>Init keyspace SDC');
    console.log('==>Initializing datatypes...');
    handleInit(datatypes, 'datatype');
    console.log('==>Initializing tables...');
    handleInit(tables, 'table');
  });
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
