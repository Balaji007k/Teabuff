const { usersModel,UserStateModel,productsModel, userCartModel, CheckOutModel, OrderConfirmationModel } = require('../models/Models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sharp = require("sharp");
const fs = require("fs").promises;
const path = require("path");
const dns = require("dns");
const { sendOtpMail } = require("../utils/sendEmail");




let otpStore = {};

// Check email domain
exports.CheckEmail = (req, res) => {
  const { email } = req.body;
  const domain = email.split("@")[1];

  dns.resolveMx(domain, (err, addresses) => {
    if (err || !addresses || addresses.length === 0) {
      return res.json({ success: false, message: "Invalid email domain" });
    }
    return res.json({ success: true, message: "Valid email domain" });
  });
};

// Send OTP
exports.sendOTP = async(req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = otp;

  const success = await sendOtpMail(email, otp);
  if (success) {
    res.json({ success: true, message: "OTP sent successfully" });
  } else {
    res.json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] && otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ success: true, message: "Email verified successfully!", email:email });
  }
  return res.json({ success: false, message: "Invalid or expired OTP" });
};

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

        if (userverify) return res.status(401).json({ message: "email is already taken" })


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
      return res.status(404).json({ message: "User eamil not found" });
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

    // 2. Password update (only if newPassword is provided)
    if (newPassword && newPassword.trim() !== "") {
      if (!oldPassword) {
        return res.status(400).json({ message: "Old password is required to set a new password" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      user.password = await bcrypt.hash(newPassword, 10);
    }

    // 3. Update other details (independent of password change)
    if (username) user.username = username;
    if (address) {
  user.address = address;

  // Update ShippingDetail address in CheckOutModel
  await CheckOutModel.updateMany(
    { UserId: userId },                       // find by userId
    { $set: { "ShippingDetails.$[].address": address } } // update all shipping addresses
  );
}
    if (phoneNumber) user.phoneNumber = phoneNumber;

    const updatedUser = await user.save();

    // 4. Update username in product comments everywhere
    if (username) {
      await productsModel.updateMany(
        { "comments.User.UserId": userId },
        { $set: { "comments.$[].User.$[elem].username": updatedUser.username } },
        { arrayFilters: [{ "elem.UserId": userId }] }
      );
    }

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



// exports.GetUserSate = async(req,res)=>{
//     const UserState = await UserStateModel.find({})
//     res.json({
//         UserState
//     })
// }

// exports.GetSingleUserSate = async (req, res) => {
//   try {
//     const userIdParam = req.params.id.trim();

//     const userState = await UserStateModel.findOne({ UserId: userIdParam });

//     if (!userState) {
//       return res.status(404).json({ message: "No UserState found" });
//     }

//     res.json({ UserState: userState.UserState });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// exports.CreateUserState = async (req, res) => {
//   try {
//     const UserId = req.params.id;
//     const { ProductId, title, price, description, url, categoryId, rating, ingredients, features, purchaseLink, likedState } = req.body;
//     const State = { ProductId, title, price, description, url, categoryId, rating, ingredients, features, purchaseLink, likedState };

//     let User = await UserStateModel.findOne({ UserId });

//     if (!User) {
//       const newUser = await UserStateModel.create({ UserId, UserState: [State] });
//       return res.json({ newUser });
//     }

//     const ProductIndex = User.UserState.findIndex(p => p.ProductId === ProductId);

//     if (ProductIndex === -1) {
//       User.UserState.push(State);
//     } else {
//       User.UserState[ProductIndex] = State;
//     }

//     const NewState = await User.save();
//     res.json({ NewState });

//   } catch (error) {
//     res.json({ message: error.message });
//   }
// };


// Get all user liked states (for all users)
exports.GetAllUserState = async (req, res) => {
  try {
    const userStates = await UserStateModel.find({});
    res.json({ userStates });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user states", error: error.message });
  }
};


// Get liked state for a single user
// exports.GetSingleUserState = async (req, res) => {
//   try {
//     const userIdParam = req.params.id.trim();

//     const userState = await UserStateModel.findOne({ UserId: userIdParam });

//     if (!userState) {
//       return res.status(404).json({ message: "No user state found" });
//     }

//     res.json({ UserState: userState.UserState });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// 1. Get all liked states for a user
exports.GetAllSingleUserStates = async (req, res) => {
  try {
    const userId = req.params.id?.trim();

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const userState = await UserStateModel.findOne({ UserId: userId });

    if (!userState) {
      return res.status(404).json({ message: "No liked states found for this user" });
    }

    // Return all liked states (array)
    res.json({
      UserId: userState.UserId,
      total: userState.UserState.length,
      UserState: userState.UserState
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};



// 2. Get liked state for a specific product
exports.GetSingleUserProductState = async (req, res) => {
  try {
    const userIdParam = req.params.id?.trim(); // userId
    const productId = req.query.productId?.trim(); // productId as query param

    if (!productId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    // Find user record
    const userState = await UserStateModel.findOne({ UserId: userIdParam });

    if (!userState) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find specific product in liked state array
    const productState = userState.UserState.find(p => p.ProductId === productId);

    if (!productState) {
      return res.status(404).json({ message: "Product not found in user's state" });
    }

    res.json({
      ProductId: productState.ProductId,
      likedState: productState.likedState
    });

  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};



// Create or update user's liked state for a product
exports.CreateOrUpdateUserState = async (req, res) => {
  try {
    const UserId = req.params.id.trim();
    const { ProductId, likedState } = req.body;

    if (!ProductId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    let user = await UserStateModel.findOne({ UserId });

    // Create new user entry if not exists
    if (!user) {
      const newUser = await UserStateModel.create({
        UserId,
        UserState: [{ ProductId, likedState }],
      });

      return res.json({
        message: "New user state created",
        productState: { ProductId, likedState },
        allStates: newUser.UserState
      });
    }

    // Find existing product
    const productIndex = user.UserState.findIndex(p => p.ProductId === ProductId);

    if (productIndex === -1) {
      // Add new product entry
      user.UserState.push({ ProductId, likedState });
    } else {
      // Update existing liked state
      user.UserState[productIndex].likedState = likedState;
    }

    const updatedUser = await user.save();

    // Extract the updated product state
    const updatedProduct = updatedUser.UserState.find(p => p.ProductId === ProductId);

    // Send both single and full data
    res.json({
      message: "User state updated successfully",
      productState: updatedProduct,
      allStates: updatedUser.UserState
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update user state",
      error: error.message
    });
  }
};

// Delete a user's liked product entry
exports.DeleteUserState = async (req, res) => {
  try {
    const UserId = req.params.id.trim();
    const { ProductId } = req.body;

    if (!ProductId) {
      return res.status(400).json({ message: "ProductId is required" });
    }

    const user = await UserStateModel.findOne({ UserId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the product being deleted
    user.UserState = user.UserState.filter(p => p.ProductId !== ProductId);

    await user.save();

    res.json({ message: "Product removed from liked state", data: user });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user state", error: error.message });
  }
};
