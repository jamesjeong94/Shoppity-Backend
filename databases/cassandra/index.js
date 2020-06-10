const cassandra = require('cassandra-driver');
const tables = require('./initTables.js');
const datatypes = require('./initDatatypes.js');
const distance = cassandra.types.distance;

const host = process.env.CASSANDRA_SERVER || '127.0.0.1';
console.log('HOST:', host);

const client = new cassandra.Client({
  contactPoints: ['3.236.11.46', '34.227.94.104'],
  localDataCenter: 'us-east',
  // keyspace: 'sdc',
  pooling: {
    coreConnectionsPerHost: {
      [distance.local]: 2,
      [distance.remote]: 1,
    },
    maxRequestsPerConnection: 32768,
  },
});

const init = () => {
  client.connect((err) => {
    if (err) {
      console.log();
    }
    const initKeyspaceQuery = `CREATE KEYSPACE IF NOT EXISTS sdc
    WITH REPLICATION = { 
     'class' : 'SimpleStrategy', 
     'replication_factor' : 2 
    };`;
    client.execute(initKeyspaceQuery, [], (err) => {
      if (err) console.log(err);
      console.log('==>Initializing keyspace SDC');
    });
    if (err) {
    }
    setTimeout(() => {
      console.log('==>Initializing datatypes...');
      handleInit(datatypes, 'datatype');
      setTimeout(() => {
        console.log('==>Initializing tables...');
        handleInit(tables, 'table');
      }, 3000);
    }, 3000);
  });
};

const handleInit = (init, type) => {
  for (let key in init) {
    client
      .execute(init[key])
      .then(() => {
        console.log(`${key} ${type} has been initialized...`);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
init();

module.exports = client;
