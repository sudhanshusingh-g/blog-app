import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { dbConnection } from "./utils/dbConfig.js";
import chalk from "chalk";
import blogRoutes from "./routes/blogRoutes.js";
import errorHandler from "./middlewares/errorHandling.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://blog-app-uutv.onrender.com",
    credentials:true
  })
);
const port = process.env.PORT || 3000;

// connecting db
dbConnection();

// routes
app.use("/api/blogs", blogRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);

app.listen(port, () => {
  console.log(chalk.bgGray.blue(`Server running at port :${port}`));
});
