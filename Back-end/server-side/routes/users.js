const express = require('express')
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer setup for profile images
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "uploads/"); // folder for profile images
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  }
});
const upload = multer({ storage });


const { getUsers, getSingleUser, getSingleUserProfileImage, createUsers, updateProfileImage, verifyUser, updateUser, LogoutUser, deleteUser, GetUserSate, GetSingleUserSate, CreateUserState } = require('../controllers/usersController');

router.route('/users').get(getUsers);
router.route('/user/:id').get(getSingleUser);
router.route('/userProfileImage/:id').get(getSingleUserProfileImage);
router.route('/users').post(createUsers);
router.put("/users/:id", upload.single("profileImage"), updateProfileImage);
router.route('/login').post(verifyUser);
router.route('/users/update/:id').put(updateUser);
router.route('/Logout/:id').post(LogoutUser);
router.route('/user/delete/:id').delete(deleteUser);

router.route('/users/State').get(GetUserSate);
router.route('/users/State/:id').get(GetSingleUserSate);
router.route('/users/State/:id').post(CreateUserState);

module.exports = router;