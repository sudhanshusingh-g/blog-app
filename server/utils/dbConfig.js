import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
dotenv.config()

export async function dbConnection(){
    try {
    const connection=await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(
      chalk.green.bgBlackBright.bold(
        `Database connected successfully at port :${connection.connection.port}`
      )
    );
    } catch (error) {
        console.error(error);
    }
}
