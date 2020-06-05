const express = require('express');
const productInfoRoute = require('./routes/productInfoRoute.js');
const cors = require('cors');

const app = express();

// const host = process.env.CASSANDRA_SERVER || 'localhost';
// console.log('HOST:', host);
app.use(cors());

app.use('/products', productInfoRoute);

module.exports = app;
