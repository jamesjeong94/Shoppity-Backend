const cassandraClient = require('./index.js');

const productInfoModel = {
  getList: (page = 1, count = '5') => {
    const getListQuery =
      'SELECT * FROM sdc.products_list WHERE product_id = 3 LIMIT ? ';
    cassandraClient
      .execute(getListQuery, [count], { prepare: true })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getProductInfo: (product_id) => {
    const getListQuery = 'SELECT * FROM sdc.products_list WHERE product_id = ?';
    console.log('model prod', product_id);
    return cassandraClient
      .execute(getListQuery, [product_id], { prepare: true })
      .then(({ rows }) => {
        return rows[0];
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getProductStyles: (product_id) => {},
  getRelatedProducts: (product_id) => {},
};

productInfoModel.getProductInfo('5');

module.exports = productInfoModel;
