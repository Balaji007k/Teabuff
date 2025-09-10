const express = require('express')
const router = express.Router();
const { getOrderConfirmation, getUserOrders, createOrderConfirmation, deleteUserOrders } = require('../controllers/OrderConfirmationController');

router.route('/orders/:userId/:orderId').get(getOrderConfirmation);
router.route('/orders/:userId').get(getUserOrders);
router.route('/orders').post(createOrderConfirmation);
router.route('/orders/:userId').delete(deleteUserOrders);

module.exports = router;