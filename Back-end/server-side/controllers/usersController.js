const { usersModel,UserStateModel } = require('../models/Models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
}


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
    const token = createToken(user._id, user.username);

    // Set secure cookie
    res.cookie("user", token, {
      httpOnly: true,
      secure: true,     // Only send on HTTPS
      sameSite: "None", // Important if frontend & backend are different domains
      maxAge: maxAge * 1000
    });

    return res.status(200).json({
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

//exports.LogoutUser = async (req, res) => {
    //try {
       // const id = req.params.id;
       // const token = req.cookies.user;
       // const decoded = jwt.verify(token, process.env.SECRET_KEY);
       // if (decoded && decoded.id === id) {
          //  res.clearCookie('user');
          //  res.status(200).json({ message: 'Logout successfully' });
       // } else {
           // res.status(403).json({ message: 'Unauthorized logout attempt' });
      //  }
   // } catch (error) {
       // res.status(500).json({ message: error.message });
   // }
//};

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
      User.UserState[ProductIndex].likedState = likedState;
    }

    const NewState = await User.save();
    res.json({ NewState });

  } catch (error) {
    res.json({ message: error.message });
  }
};


