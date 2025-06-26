const express = require('express')
const router = express.Router();
const { getProduct, getSingleProduct, getProductReviews, createProduct, updateProduct, deleteSingleProduct } = require('../controllers/productController')

router.route('/products').get(getProduct);
router.route('/product/:id').get(getSingleProduct);
router.route('/products/Reviews/:id').get(getProductReviews);
router.route('/product').post(createProduct);
router.route('/product/:id').put(updateProduct);
router.route('/product/:id').delete(deleteSingleProduct);

module.exports= router;