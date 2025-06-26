const express = require('express')
const router = express.Router();
const { getCategory, createCategory } = require('../controllers/categoryController');

router.route('/category').get(getCategory);
router.route('/category').post(createCategory);

module.exports = router;