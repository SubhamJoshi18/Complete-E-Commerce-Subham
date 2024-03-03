import { Router } from "express";
import {
  LoginController,
  registerController,
  LogoutController,
} from "../controller/auth.controller.js";
import { verifyAccessToken } from "../middleware/verifytoken.js";
const authrouter = Router();

authrouter.post("/register", registerController);
authrouter.post("/login", LoginController);
authrouter.get("/logout", LogoutController);
authrouter.get("/check", (req, res) => {
  res.json({
    message: "You are Verified",
  });
});

export default authrouter;
