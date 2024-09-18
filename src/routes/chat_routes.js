import { Router } from "express";
import { createOrUpdateChat, getUserChats, getChatById, createChat} from "../controllers/chat_controllers.js";

const chatRouter = Router();

// get chat that alredy have been started for a user
chatRouter.route('/getuserchats').post(getUserChats);

// create a new chat or push a new message between two users
// chatRouter.route('/createnewchat').post(createOrUpdateChat);

chatRouter.route('/getchatbyid').post(getChatById);
chatRouter.route('/createchat').post(createChat);

export default chatRouter;