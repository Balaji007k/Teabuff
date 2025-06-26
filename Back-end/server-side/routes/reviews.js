const express = require('express')
const router = express.Router();
const { getReview, createReview } = require('../controllers/reviewControllers');

router.route('/reviews').get(getReview);
router.route('/reviews').post(createReview);

module.exports = router;