const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../databases/cassandra/index');
const throttle = require('throttle');

const styles = path.join(__dirname, '../data/styles.csv');

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

const insertQuery = (data) => {
  const queryTemplate =
    'INSERT INTO sdc.styles (style_id,product_id,name,sale_price,original_price,default_style) VALUES (?,?,?,?,?,?)';
  cassandraClient
    .execute(queryTemplate, Object.values(data), { prepare: true })
    .catch((err) => {
      console.log(err);
    });
};

const stylesETL = () => {
  console.log('==>Running ETL for styles');
  const readStream = fs.createReadStream(styles, 'utf-8');

  readStream.pipe(new throttle(300000)).pipe(parse()).pipe(sanitizeData);
  const timeBefore = new Date();
  sanitizeData
    .on('data', (data) => {
      insertQuery(data);
    })
    .on('end', () => {
      console.log('==>Styles HAS BEEN POPULATED');
      console.log(`Time taken for styles ETL: ${new Date() - timeBefore}ms`);
    });
};

stylesETL();
