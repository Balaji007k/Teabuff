const { usersModel,UserStateModel,productsModel, userCartModel, CheckOutModel, OrderConfirmationModel } = require('../models/Models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id, username) => {
    return jwt.sign({ id, username }, process.env.SECRET_KEY, {
        expiresIn: maxAge
    });
};


exports.getUsers = async (req, res, next) => {
    const users = await usersModel.find({})
    res.json({
        users
    })
};

exports.getSingleUser = async (req, res) => {
  const id = req.params.id;
    const user = await usersModel.findById(id)
    res.json({
        user
    })
};

exports.getSingleUserProfileImage = async (req, res) => {
  try {
    const id = req.params.id;
    // Select only profileImage
    const user = await usersModel.findById(id).select('profileImage');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ profileImage: user.profileImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.createUsers = async (req, res, next) => {
    try {
        const { username, email, password, phoneNumber } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds is sufficient

        const users = await usersModel.find({})

        const userverify = users.find(u => u.email === email)

        if (userverify) return res.status(401).json({ message: "username is already taken" })


        const newUser = {
            username,
            email,
            password: hashedPassword,
            phoneNumber
        };

        await usersModel.create(newUser);

        res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Create User Error:", error);
        res.status(500).json({
            message: "User not created",
            error: error.message
        });
    }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    
const uploadsDir = path.join(__dirname, "../uploads");
const originalPath = req.file.path;
const compressedFileName = `compressed_${req.file.filename}`;
const compressedPath = path.join(uploadsDir, compressedFileName);

// Compress image
await sharp(originalPath)
  .resize(200, 200)
  .jpeg({ quality: 70 })
  .toFile(compressedPath);

// Delete original file safely
try {
  await fs.unlink(originalPath);
} catch (err) {
  console.warn("Could not delete original file, skipping:", err.message);
}

    // Update user profileImage
    const updatedUser = await usersModel.findByIdAndUpdate(
      userId,
      { profileImage: `/uploads/${compressedFileName}` },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    // Update userImage in product comments
    await productsModel.updateMany(
      { "comments.User.UserId": userId },
      { $set: { "comments.$[comment].User.$[user].userImage": updatedUser.profileImage } },
      { arrayFilters: [{ "comment.User": { $exists: true } }, { "user.UserId": userId }] }
    );

    res.status(200).json({
      message: "Profile image updated successfully",
      profileImage: updatedUser.profileImage,
    });
  } catch (err) {
    console.error("Update Profile Image Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};






exports.verifyUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Search only the user you need
    const user = await usersModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare hashed password
    const verified = await bcrypt.compare(password, user.password);
    if (!verified) {
      return res.status(400).json({ message: "Password does not match" });
    }

    // Create JWT token
    const token = createToken(user._id, user.username , user.email);

    // Set secure cookie
    res.cookie("user", token, {
      httpOnly: true,
      secure: true,     // Only send on HTTPS
      sameSite: "None", // Important if frontend & backend are different domains
      maxAge: maxAge * 1000
    });

    return res.status(200).json({
      email: user.email,
      user: user.username,
      token,
      message: "success"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Verification failed",
      error: error.message
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword, username, address, phoneNumber } = req.body;

    // 1. Find user
    const user = await usersModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. Compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    // 3. Hash new password (only if provided)
    let hashedPassword = user.password;
    if (newPassword && newPassword.trim() !== "") {
      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // 4. Update user details
    user.username = username || user.username;
    user.password = hashedPassword;
    user.address = address || user.address;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.LogoutUser = async (req, res) => {
  try {
    const id = req.params.id;
    const token = req.cookies.user;

    if (!token) {
      return res.status(400).json({ message: "No active session" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      if (decoded.id !== id) {
        return res.status(403).json({ message: "Unauthorized logout attempt" });
      }

      res.clearCookie("user", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      return res.status(200).json({ message: "Logout successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1. Delete user
    const user = await usersModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Delete user cart
    await userCartModel.findOneAndDelete({ userId });

    // 3. Delete user state (liked products)
    await UserStateModel.findOneAndDelete({ UserId: userId });

    // 4. Delete user checkout/shipping details
    await CheckOutModel.deleteMany({ UserId: userId });

    // 5. Delete orders of that user
    await OrderConfirmationModel.deleteMany({ userId });

    // 6. Remove user comments from products
    await productsModel.updateMany(
      { "comments.User.UserId": userId },
      { $pull: { "comments.$[].User": { UserId: userId } } }
    );

    // 7. (Optional) If you want to delete user's own reviews in reviews collection
    //await reviewsModel.deleteMany({ name: user.username });

    return res.status(200).json({ message: "User and related data deleted successfully" });

  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



exports.GetUserSate = async(req,res)=>{
    const UserState = await UserStateModel.find({})
    res.json({
        UserState
    })
}

exports.GetSingleUserSate = async (req, res) => {
  try {
    const userIdParam = req.params.id.trim();

    const userState = await UserStateModel.findOne({ UserId: userIdParam });

    if (!userState) {
      return res.status(404).json({ message: "No UserState found" });
    }

    res.json({ UserState: userState.UserState });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.CreateUserState = async (req, res) => {
  try {
    const UserId = req.params.id;
    const { ProductId, title, price, description, url, categoryId, rating, ingredients, features, purchaseLink, likedState } = req.body;
    const State = { ProductId, title, price, description, url, categoryId, rating, ingredients, features, purchaseLink, likedState };

    let User = await UserStateModel.findOne({ UserId });

    if (!User) {
      const newUser = await UserStateModel.create({ UserId, UserState: [State] });
      return res.json({ newUser });
    }

    const ProductIndex = User.UserState.findIndex(p => p.ProductId === ProductId);

    if (ProductIndex === -1) {
      User.UserState.push(State);
    } else {
      User.UserState[ProductIndex] = State;
    }

    const NewState = await User.save();
    res.json({ NewState });

  } catch (error) {
    res.json({ message: error.message });
  }
};


