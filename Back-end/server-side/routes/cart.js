const express = require('express')
const router = express.Router();
const { getCartItem, createCartItem, updateCartItems, deleteCartItem } = require('../controllers/cartControllers');

router.route('/carts/:id').get(getCartItem);
router.route('/carts').post(createCartItem);
router.route('/carts/:userId').put(updateCartItems);
router.route('/carts/:userId/:productId').delete(deleteCartItem);


module.exports = router;