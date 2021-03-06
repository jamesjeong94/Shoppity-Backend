const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const throttle = require('throttle');
const cassandraClient = require('../../databases/cassandra');
const { logTimeAndResolve } = require('./ETLHelper');

const related = path.join(__dirname, '../../data/related.csv');

const sanitizeData = new stream.Transform({ objectMode: true });

sanitizeData._transform = function (chunk, encoding, done) {
  for (let key in chunk) {
    if (key === 'id') {
      chunk[key] = Number(chunk[key]);
    }
    if (key.match(/[\s]/g)) {
      let newKey = key.trim();
      chunk[newKey] = chunk[key];
      delete chunk[key];
    }
  }
  this.push(chunk);
  done();
};

const relatedETL = () => {
  return new Promise((res, rej) => {
    const queryTemplate = `INSERT INTO sdc.related (product_id, related_products) VALUES (?, ?)`;
    const readStream = fs.createReadStream(related, 'utf-8');

    readStream.pipe(new throttle(1000000)).pipe(parse()).pipe(sanitizeData);
    const timeBefore = new Date();

    let prevId = '1';
    let cache = [];
    sanitizeData
      .on('data', (data) => {
        if (prevId === data.current_product_id) {
          cache.push(data.related_product_id);
        } else {
          cache.push(data.related_product_id);
          cassandraClient
            .execute(queryTemplate, [prevId, cache], { prepare: true })
            .catch((err) => {
              rej(err);
            });
          cache = [];
          prevId = data.current_product_id;
        }
      })
      .on('error', (err) => {
        rej(err);
      })
      .on('end', () => {
        logTimeAndResolve(timeBefore, 'related', res);
      });
  });
};

module.exports = relatedETL;
