import { Router } from "express";
import { chatBot } from "../chatbot/index.js";

const chatBotRouter = Router();

chatBotRouter.route('/').post(chatBot)

export default chatBotRouter;