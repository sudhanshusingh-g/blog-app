import express from "express";
const router=express.Router();

import { registerUser,loginUser, logoutUser, getCurrentUser, deleteUser } from "../controllers/userController.js";
import authentication from "../middlewares/authentication.js";

router.post("/register",registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/",authentication,getCurrentUser);
router.delete("/:id", authentication, deleteUser);

export default router;