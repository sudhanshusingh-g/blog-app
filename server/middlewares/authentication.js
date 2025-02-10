import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(403).json({ error: "Unauthorized access" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next(); // Proceed to the next middleware/route handler
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authentication;
