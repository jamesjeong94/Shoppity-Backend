const express = require('express');
const productInfoRoute = require('./routes/productInfoRoute.js');
const cors = require('cors');

const app = express();

app.use((req, res, next) => {
  next();
});

app.use(cors({ origin: 'http://localhost:4000' }));
app.options(cors({ origin: 'http://localhost:4000' }));

app.use('/products', productInfoRoute);

module.exports = app;
