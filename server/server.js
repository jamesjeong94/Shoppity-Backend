const express = require('express');
const productInfoRoute = require('./routes/productInfoRoute.js');

const app = express();

app.use('/products', productInfoRoute);

module.exports = app;
