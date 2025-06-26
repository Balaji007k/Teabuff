const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.user;

  if (!token || token.trim() === "") {
  return res.status(401).json({ message: "Unauthorized: No token" });
}


  try {
    if (!process.env.SECRET_KEY) {
  console.warn("SECRET_KEY is not set");
}

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = { requireAuth };