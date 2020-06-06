const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../../databases/cassandra/index');
const throttle = require('throttle');
const { logTimeAndResolve } = require('./ETLHelper');

const styles = path.join(__dirname, '../../data/styles.csv');

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

const stylesETL = () => {
  return new Promise((res, rej) => {
    console.log('==>Running ETL for styles');
    const readStream = fs.createReadStream(styles, 'utf-8');

    readStream.pipe(new throttle(1000000)).pipe(parse()).pipe(sanitizeData);
    const timeBefore = new Date();
    sanitizeData
      .on('data', (data) => {
        const queryTemplate =
          'INSERT INTO sdc.styles (style_id,product_id,name,sale_price,original_price,default_style) VALUES (?,?,?,?,?,?)';
        cassandraClient
          .execute(queryTemplate, Object.values(data), { prepare: true })
          .catch((err) => {
            rej();
          });
      })
      .on('end', () => {
        logTimeAndResolve(timeBefore, 'styles', res);
      });
  });
};

module.exports = stylesETL;
