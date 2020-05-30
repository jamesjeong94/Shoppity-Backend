const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../databases/cassandra');

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

const productETL = () => {
  const productQueryTemplate = `INSERT INTO sdc.products_list (product_id,name,slogan,description,category,default_price) VALUES (?,?,?,?,?,?)`;
  const readStream = fs.createReadStream(productInfo, 'utf-8');

  readStream.pipe(parse()).pipe(sanitizeData);
  const timeBefore = new Date();

  sanitizeData
    .on('data', (data) => {
      const productQueryValues = Object.values(data);
      cassandraClient
        .execute(productQueryTemplate, productQueryValues, { prepare: true })
        .catch((err) => {
          console.log(err);
        });
    })
    .on('end', () => {
      console.log('==>PRODUCT LIST HAS BEEN POPULATED');
      console.log(
        `Time taken for product_list ETL: ${new Date() - timeBefore}ms`
      );
    });
};
