const express = require('express')
const router = express.Router();
const { ContactMail } = require('../controllers/ContactMessage');

router.route('/api/Contact').post(ContactMail);

module.exports = router;