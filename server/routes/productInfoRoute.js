const express = require('express');
const cors = require('cors');
const productInfoController = require('../controllers/productInfoController.js');

const router = express.Router();

router.use(cors({ origin: 'http://localhost:4000' }));
router.options(cors({ origin: 'http://localhost:4000' }));

router.get('/list', productInfoController.list);

router.get('/:product_id', productInfoController.productInfo);

router.get('/:product_id/styles', productInfoController.styles);

router.get('/:product_id/related', productInfoController.related);

module.exports = router;
