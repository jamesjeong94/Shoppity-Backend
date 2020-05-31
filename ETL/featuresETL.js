const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../databases/cassandra');

const features = path.join(__dirname, '../data/features.csv');

const sanitizeData = new stream.Transform({ objectMode: true });

sanitizeData._transform = function (chunk, encoding, done) {
  // for (let key in chunk) {
  //   if (key === 'id') {
  //     chunk[key] = Number(chunk[key]);
  //   }
  //   if (key.match(/[\s]/g)) {
  //     let newKey = key.trim();
  //     chunk[newKey] = chunk[key];
  //     delete chunk[key];
  //   }
  // }
  this.push(chunk);
  done();
};

const featuresETL = () => {
  const queryTemplate = `UPDATE sdc.products_list SET features = ? WHERE product_id = ?`;
  const readStream = fs.createReadStream(features, 'utf-8');

  readStream
    .pipe(parse(['id', 'product_id', 'feature', 'value']))
    .pipe(sanitizeData);
  const timeBefore = new Date();
  let prevId = '1';
  let cache = [];
  sanitizeData
    .on('data', (data) => {
      if (data.product_id === prevId) {
        cache.push({ feature: data.feature, value: data.value });
      } else {
        cassandraClient
          .execute(queryTemplate, [cache, prevId], { prepare: true })
          .catch((err) => {
            console.log(err);
          });
        prevId = data.product_id;
        cache = [];
        cache.push({ feature: data.feature, value: data.value });
      }
    })
    .on('end', () => {
      console.log('==>FEATURES HAVE BEEN POPULATED');
      console.log(`Time taken for features ETL: ${new Date() - timeBefore}ms`);
    });
};

featuresETL();
