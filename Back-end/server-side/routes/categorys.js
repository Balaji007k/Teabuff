const express = require('express')
const router = express.Router();
const { getCategory, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.route('/category').get(getCategory);
router.route('/category').post(createCategory);
router.route('/category/:id').put(updateCategory);
router.route('/category/:id').delete(deleteCategory);

module.exports = router;