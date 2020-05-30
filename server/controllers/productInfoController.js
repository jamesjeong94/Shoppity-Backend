const productsModel = require('../../databases/cassandra/model.js');

const productInfoController = {
  list: (req, res) => {
    res.send([]);
    console.log('list');
  },
  productInfo: (req, res) => {
    const product_id = req.params.product_id;
    console.log(product_id);
    productsModel.getProductInfo(product_id).then((data) => {
      res.send(data);
    });
  },
  styles: (req, res) => {
    console.log(req.params, 'style');
  },
  related: (req, res) => {
    console.log(req.params, 'related');
  },
};

module.exports = productInfoController;
