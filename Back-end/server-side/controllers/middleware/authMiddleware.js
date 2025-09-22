const jwt = require("jsonwebtoken");
const { usersModel } = require("../../models/Models");

const requireAuth = async (req, res, next) => {
  const token = req.cookies.user;

  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    if (!process.env.SECRET_KEY) {
      console.warn("SECRET_KEY is not set");
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Check if user still exists in DB
    const user = await usersModel.findById(decoded.id);
    
    if (!user) {
      // User is deleted → clear cookie
      res.clearCookie("user", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
      return res.status(401).json({ message: "Account deleted. Please log in again." });
    }

    // Attach user to request for next handlers
    req.user = user;
    next();
  } catch (err) {
    // Invalid/expired token → clear cookie
    res.clearCookie("user", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { requireAuth };
