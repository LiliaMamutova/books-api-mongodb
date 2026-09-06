import { Router } from "express";
import {celebrate} from "celebrate";
import {loginUserSchema, registerUserSchema} from "../validations/authValidation.js";
import {registerUser, loginUser, refreshUserSession, logoutUser,} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register",
  celebrate(registerUserSchema, { abortEarly: false }),
  registerUser);

authRouter.post("/login",
  celebrate(loginUserSchema, { abortEarly: false }),
  loginUser);

authRouter.post("/refresh", refreshUserSession);

authRouter.post("/logout", logoutUser);


export default authRouter;

