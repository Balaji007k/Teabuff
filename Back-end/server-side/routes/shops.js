const express = require('express')
const router = express.Router();
const { getShop, createShop, updateShop } = require('../controllers/shopControllers');

router.route('/shops').get(getShop);
router.route('/shop').post(createShop);
router.route('/shop/:id').put(updateShop);

module.exports = router;