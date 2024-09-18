import { Router } from "express";
import { createGroupChat, pushNewMessageInGroup, exitGroupChat, 
    deleteGroupChat, getUserGroups, getGroupChatByGroupId } from "../controllers/groupchat_controllers.js";

const groupChatRouter = Router();

groupChatRouter.route('/creategroup').post(createGroupChat);

groupChatRouter.route('/pushmessageingroup').post(pushNewMessageInGroup);

groupChatRouter.route('/exitgroup').post(exitGroupChat);

groupChatRouter.route('/deletegroupchat').post(deleteGroupChat);

groupChatRouter.route('/getusergroups').post(getUserGroups);

groupChatRouter.route('/getgroupchatbyid').post(getGroupChatByGroupId)

export default groupChatRouter