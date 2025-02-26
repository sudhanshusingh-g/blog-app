import express from "express";
const router=express.Router();

import { registerUser,loginUser, logoutUser, getCurrentUser } from "../controllers/userController.js";
import authentication from "../middlewares/authentication.js";

router.post("/register",registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/",authentication,getCurrentUser);

export default router;