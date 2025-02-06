import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
const dbConnection=mongoose.connect(process.env.MONGODB_URI);
dbConnection()
console.log(typeof dbConnection);
