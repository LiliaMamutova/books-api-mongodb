import {Router} from "express";
import {updateUserAvatar} from "../controllers/userController.js";
import authenticate from "../middleware/authenticate.js";
import upload from "../middleware/multer.js"


const userRouter = new Router();

userRouter.patch("/me/attach",
  authenticate,
  upload.single("attach"),
  updateUserAvatar);


export default userRouter;
