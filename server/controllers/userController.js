import User from "../models/user.js";
import jwt from "jsonwebtoken";
import Blog from "../models/blog.js";

const SECRET_KEY = process.env.JWT_SECRET;

// Register user
async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters long." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already registered. Please login." });
    }


    // Save user with hashed password
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}


async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User not found. Please register." });
    }

    // Correct password comparison (Remove the second argument)
    const isPasswordMatch = await existingUser.comparePassword(password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect password!" });
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: existingUser._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res
      .status(200)
      .json({ success: true, message: "Logged in successfully.", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


// logout user
async function logoutUser(req, res) {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to log out." });
  }
}

// current user
async function getCurrentUser(req, res) {
  try {
    const currentUser = req.user;
    const user = await User.findById(currentUser._id)
      .populate({
        path: "blogs",
        select: "title body createdAt",
      })
      .exec();

    if (!user) {
      return res.status(404).json({ error: "No user found. Please register." });
    }

    const { _id, email, name, image, blogs } = user;

    res.json({
      _id,
      email,
      name,
      image,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function deleteUser(req, res) {
  try {
    const userId = req.params.id;

    // Ensure the user exists before deletion
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete all blogs created by this user
    await Blog.deleteMany({ author: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User and associated blogs deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
}

export { registerUser, loginUser, logoutUser, getCurrentUser,deleteUser };
