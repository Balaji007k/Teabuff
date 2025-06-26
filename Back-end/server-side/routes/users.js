const express = require('express')
const router = express.Router();
const { getUsers, createUsers, verifyUser, LogoutUser, GetUserSate, GetSingleUserSate, CreateUserState } = require('../controllers/usersController');

router.route('/users').get(getUsers);
router.route('/users').post(createUsers);
router.route('/login').post(verifyUser);
router.route('/Logout/:id').post(LogoutUser);

router.route('/users/State').get(GetUserSate);
router.route('/users/State/:id').get(GetSingleUserSate);
router.route('/users/State/:id').post(CreateUserState);

module.exports = router;