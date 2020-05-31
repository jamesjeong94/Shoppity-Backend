const parse = require('csv-parser');
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const cassandraClient = require('../databases/cassandra');

const photos = path.join(__dirname, '../data/photos.csv');

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

const photosETL = () => {
  const queryTemplate = `UPDATE sdc.styles SET photos = ? WHERE style_id = ?`;
  const readStream = fs.createReadStream(photos, 'utf-8');

  readStream.pipe(parse()).pipe(sanitizeData);
  const timeBefore = new Date();
  let prevId = '1';
  let cache = [];

  sanitizeData
    .on('data', (data) => {
      if (data[1] === prevId) {
        cache.push({ thumbnail_url: data[3], url: data[2] });
      } else {
        cassandraClient
          .execute(queryTemplate, [cache, prevId], { prepare: true })
          .then(() => {
            console.log('Done');
          })
          .catch((err) => {
            console.log(err);
          });
        prevId = data[1];
        cache = [];
        cache.push({ thumbnail_url: data[3], url: data[2] });
      }
    })
    .on('end', () => {
      console.log('==>PHOTOS HAS BEEN POPULATED');
      console.log(`Time taken for photos ETL: ${new Date() - timeBefore}ms`);
    });
};

photosETL();
