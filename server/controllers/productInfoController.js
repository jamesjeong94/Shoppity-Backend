const productInfoController = {
  list: (req, res) => {
    res.send([]);
    console.log('list');
  },
  productInfo: (req, res) => {
    console.log(req.params);
  },
  styles: (req, res) => {
    console.log(req.params, 'style');
  },
  related: (req, res) => {
    console.log(req.params, 'related');
  },
};

module.exports = productInfoController;
