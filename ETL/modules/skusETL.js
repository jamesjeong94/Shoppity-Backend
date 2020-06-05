const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../../databases/cassandra');
const { logTimeAndResolve } = require('./ETLHelper');

const skus = path.join(__dirname, '../../data/skus.csv');

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
  return new Promise((res, rej) => {
    const queryTemplate = `INSERT INTO sdc.skus (style_id,skus) VALUES (?,?)`;
    const readStream = fs.createReadStream(skus, 'utf-8');

    readStream.pipe(parse()).pipe(sanitizeData);
    const timeBefore = new Date();
    let prevId = '1';
    let cache = [];
    sanitizeData
      .on('data', (data) => {
        if (prevId === data.styleId) {
          cache.push({ size: data.size, quantity: data.quantity });
        } else {
          cache.push({ size: data.size, quantity: data.quantity });
          cassandraClient
            .execute(queryTemplate, [prevId, cache], { prepare: true })
            .catch((err) => {
              rej(err);
            });
          cache = [];
          prevId = data.styleId;
        }
      })
      .on('end', () => {
        logTimeAndResolve(timeBefore, 'skus', res);
      });
  });
};

module.exports = skusETL;
