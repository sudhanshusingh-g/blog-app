import express from "express"
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./utils/dbConfig.js";
import chalk from "chalk";
import blogRoutes from "./routes/blogRoutes.js"
import errorHandler from "./middlewares/errorHandling.js";
import userRoutes from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
dotenv.config();

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  })
);
const port = process.env.PORT || 3000;

// connecting db
dbConnection();

// routes
app.use('/api/blogs',blogRoutes)
app.use('/api/users',userRoutes);

app.use(errorHandler)


app.listen(port,()=>{
    console.log(chalk.bgGray.blue(`Server running at port :${port}`));
    
})