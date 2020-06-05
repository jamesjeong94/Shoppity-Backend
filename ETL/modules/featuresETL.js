const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../../databases/cassandra');
const { logTimeAndResolve } = require('./ETLHelper.js');

const features = path.join(__dirname, '../../data/features.csv');

const sanitizeData = new stream.Transform({ objectMode: true });

sanitizeData._transform = function (chunk, encoding, done) {
  this.push(chunk);
  done();
};

const featuresETL = () => {
  return new Promise((res, rej) => {
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
              rej(err);
            });
          prevId = data.product_id;
          cache = [];
          cache.push({ feature: data.feature, value: data.value });
        }
      })
      .on('error', (err) => {
        rej(err);
      })
      .on('end', () => {
        logTimeAndResolve(timeBefore, 'features', res);
      });
  });
};

module.exports = featuresETL;
