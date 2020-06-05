const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../../databases/cassandra');

const skus = path.join(__dirname, '../data/skus.csv');

const sanitizeData = new stream.Transform({ objectMode: true });

sanitizeData._transform = function (chunk, encoding, done) {
  for (let key in chunk) {
    if (key.match(/[\s]/g)) {
      let newKey = key.trim();
      chunk[newKey] = chunk[key];
      delete chunk[key];
    }
  }
  this.push(chunk);
  done();
};

const skusETL = () => {
  const queryTemplate = `INSERT INTO sdc.skus (style_id,skus) VALUES (?,?)`;
  const readStream = fs.createReadStream(skus, 'utf-8');

  readStream.pipe(parse()).pipe(sanitizeData);
  const timeBefore = new Date();
  let prevId = '1';
  let cache = [];
  sanitizeData
    .on('data', (data) => {
      // console.log(data);
      if (prevId === data.styleId) {
        cache.push({ size: data.size, quantity: data.quantity });
      } else {
        cache.push({ size: data.size, quantity: data.quantity });
        // console.log(cache);
        cassandraClient
          .execute(queryTemplate, [prevId, cache], { prepare: true })
          .then(() => {
            console.log('inserted');
          })
          .catch((err) => {
            console.log(err);
          });
        cache = [];
        prevId = data.styleId;
      }
    })
    .on('end', () => {
      console.log('==>SKU HAS BEEN POPULATED');
      console.log(`Time taken for SKU ETL: ${new Date() - timeBefore}ms`);
    });
};

module.exports = skusETL;
