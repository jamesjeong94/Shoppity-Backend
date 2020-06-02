const productsModel = require('../../databases/cassandra/model.js');

const productInfoController = {
  list: (req, res) => {
    res.send([]);
  },
  productInfo: (req, res) => {
    const product_id = req.params.product_id;
    productsModel.getProductInfo(product_id).then((data) => {
      res.send(data);
    });
  },
  styles: (req, res) => {
    const product_id = req.params.product_id;
    productsModel.getProductStyles(product_id).then((data) => {
      res.send(data);
    });
  },
  related: (req, res) => {
    const product_id = req.params.product_id;
    productsModel.getRelatedProducts(product_id).then((data) => {
      res.send(data);
    });
  },
};

module.exports = productInfoController;
