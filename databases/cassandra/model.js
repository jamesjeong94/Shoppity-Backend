const cassandraClient = require('./index.js');
const Promise = require('bluebird');

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
    return cassandraClient
      .execute(getListQuery, [product_id], { prepare: true })
      .then(({ rows }) => {
        return rows[0];
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getProductStyles: (product_id) => {
    const styleQuery =
      'select style_id,default_style, original_price, sale_price from sdc.styles where product_id = ?';
    let returnData = {
      product_id: product_id,
    };
    return cassandraClient
      .execute(styleQuery, [product_id], { prepare: true })
      .then(({ rows }) => {
        return rows;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  getRelatedProducts: (product_id) => {
    const relatedQuery = 'select * from sdc.related where product_id = ?';
    return cassandraClient
      .execute(relatedQuery, [product_id], {
        prepare: true,
      })
      .then(({ rows }) => {
        return rows[0].related_products;
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

module.exports = productInfoModel;
