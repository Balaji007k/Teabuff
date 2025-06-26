const express = require('express')
const router = express.Router();
const { CheckOutList, getSingleCheckOut, createNewCheckOut } = require('../controllers/CheckoutController')

router.route('/Checkouts').get(CheckOutList);
router.route('/Checkouts/:id').get(getSingleCheckOut);
router.route('/NewCheckout/:id').post(createNewCheckOut);

module.exports= router;