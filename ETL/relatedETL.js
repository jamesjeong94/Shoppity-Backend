const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../databases/cassandra');

const related = path.join(__dirname, '../data/related.csv');

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
  const productQueryTemplate = `UPDATE sdc.products_list set related = ? WHERE product_id = ? VALUES (?,?)`;
  const readStream = fs.createReadStream(related, 'utf-8');

  readStream.pipe(parse()).pipe(sanitizeData);
  const timeBefore = new Date();

  sanitizeData
    .on('data', (data) => {
      const productQueryValues = Object.values(data);
      console.log(data);
      // cassandraClient
      //   .execute(productQueryTemplate, productQueryValues, { prepare: true })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    })
    .on('end', () => {
      console.log('==>PRODUCT LIST HAS BEEN POPULATED');
      console.log(
        `Time taken for product_list ETL: ${new Date() - timeBefore}ms`
      );
    });
};

relatedETL();
