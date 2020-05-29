const csv = require('csv');
const parse = require('csv-parse');
const fs = require('fs');
const path = require('path');

const sampleData = path.join(__dirname + '/../data/features.csv');
const output = [];
let count = 0;

const parser = parse({ delimiter: ',' });

const readStream = fs.createReadStream(sampleData);

readStream.on('data', (data) => {
  count++;
  console.log(data);
});
