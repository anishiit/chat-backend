import { Router } from "express";
import { createUser, getAllUsers, getUser, loginUser, searchUser } from "../controllers/user_controllers.js";

const userRouter = Router();

userRouter.route('/register').post(createUser);

userRouter.route('/login').post(loginUser);

userRouter.route('/searchuser').post(searchUser);

userRouter.route("/getuser").post(getUser)

userRouter.route("/getallusers").get(getAllUsers)

export default userRouter;