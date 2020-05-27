const express = require('express');
const productInfoController = require('../controllers/productInfoController.js');

const router = express.Router();

router.get('/list', productInfoController.list);

router.get('/:product_id', productInfoController.productInfo);

router.get('/:product_id/styles', productInfoController.styles);

router.get('/:product_id/related', productInfoController.related);

module.exports = router;
