// middleware/auth.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config();

const authentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Authorization token required" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authentication;
