import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minLength: [3, "Name should be at least 3 characters"],
  },
  email: {
    type: String,
    required: [true, "Enter a valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password should be at least 8 characters"],
    minLength: [8, "Password should be at least 8 characters"],
  },
  image: {
    type: String,
    default: "https://placehold.co/400",
  },
});

export default mongoose.model("User",userSchema);