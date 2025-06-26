const express = require('express')
const router = express.Router();
const { getShop, createShop } = require('../controllers/shopControllers');

router.route('/shops').get(getShop);
router.route('/shops').post(createShop);

module.exports = router;