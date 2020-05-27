const express = require('express');
const productInfoRoute = require('./routes/productInfoRoute.js');

const app = express();
const port = process.env.PORT || 3000;

app.use('/product', productInfoRoute);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;