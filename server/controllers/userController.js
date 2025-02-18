import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"


const SECRET_KEY = process.env.JWT_SECRET;

// Register user
async function registerUser(req,res){
    try {
        const {name,email,password}=req.body;
        // Validate input
        if (!name || !email || !password) {
          return res.status(400).json({ error: "All fields are required." });
        }
        if (password.length < 8) {
          return res
            .status(400)
            .json({ error: "Password must be at least 8 characters long." });
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(409).json({ error: "User already exists." });
        }
        // Hash password
        const salt=await bcrypt.genSalt(10);
        const hashPassword=await bcrypt.hash(password,salt);

        // Create new user
        const newUser=new User({
            name,
            email,
            password:hashPassword,
        })
        await newUser.save();
        res
          .status(201)
          .json({
            message: "User registered successfully",
            userId: newUser._id,
          });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// login user
async function loginUser(req,res){
  try {
    const { email, password } = req.body;
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res
        .status(404)
        .json({ error: "User not found. Please register." });
    }
    // Compare passwords
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    // Generate JWT Token
    const token = jwt.sign({ userId: existingUser._id }, SECRET_KEY, {
      expiresIn: "1h",
    });
    

    res.status(200).json({
      message: "Login successful",
      token,
      existingUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export {registerUser,loginUser}