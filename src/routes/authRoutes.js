import { Router } from "express";
import {celebrate} from "celebrate";
import {
  loginUserSchema,
  registerUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema
} from "../validations/authValidation.js";
import {
  registerUser,
  loginUser,
  refreshUserSession,
  logoutUser,
  requestResetEmail, verifyUser, resetPassword,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/register",
  celebrate(registerUserSchema, { abortEarly: false }),
  registerUser);

authRouter.post("/login",
  celebrate(loginUserSchema, { abortEarly: false }),
  loginUser);

authRouter.post("/refresh", refreshUserSession);

authRouter.post("/logout", logoutUser);

authRouter.post("/request-reset-email",
  celebrate(requestResetEmailSchema, { abortEarly: false }),
  requestResetEmail);

authRouter.get("/verify", verifyUser);

authRouter.post("/reset-password",
  celebrate(resetPasswordSchema, { abortEarly: false }),
  resetPassword);

export default authRouter;

