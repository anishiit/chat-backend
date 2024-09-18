import User from "../models/user_model.js";
import Chat from "../models/chat-model.js"
import dayjs from "dayjs";
import mongoose from "mongoose";



export async function createChat(req,res){
    try {
        const {username1, username2} = req.body;

        if(!(username1?.trim()) || !(username2?.trim())){
            return res.status(400).json({
                message:"Provide all required field!"
            })
        }

        const User1 = await User.findOne({username:username1});
        if(!User1){
            return res.status(404).json({
                message:"Provide correct username1 field!"
            })
        }

        const User2 = await User.findOne({username:username2});
        if(!User2){
            return res.status(404).json({
                message:"Provide correct username2 field!"
            })
        }

        const chatId1 = `${User1._id}${User2._id}`;
        const chatId2 = `${User2._id}${User1._id}`;

        const isChatExist = await Chat.findOne({
            $or: [
                { chatId: chatId1 },
                { chatId: chatId2 }
            ]
        });

        // console.log(User1._id , User2._id)

        const newChat = new Chat({
            chatId:chatId1,
            userId1:User1._id,
            userId2:User2._id,
            username1:username1,
            username2:username2,
            allMessages: [],
            lastMessage:""
        })

        const createdChat = await newChat.save();

        if(!createdChat){
            return res.status(500).json({
                message:"Something went wrong while creating a new chat!"
            })
        }

        // adding in connectedUser
        const userId1 = new mongoose.Types.ObjectId(User1._id);
        const userId2 = new mongoose.Types.ObjectId(User2._id);

        const updateUser1 = await User.findByIdAndUpdate(User1._id,
            {$push : {connectedUsers:User2._id }},
            {new:true}
        )

        const updateUser2 = await User.findByIdAndUpdate(User2._id,
            {$push : {connectedUsers:User1._id }},
            {new:true}
        )

        if(!updateUser1 || !updateUser2){
            return res.status(500).json({
                message:"Something went wrong while creating a new chat between two users!",
            })
        }

        return res.status(201).json({
            message:"Chat created successfully",
            chat:createdChat,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Something went wrong while creating a new chat between two users!",
            error:error,
        })
    }
}


export async function createOrUpdateChat(req, res){
    try {
        const {username1, username2, sender, message } = req.body;

        if(!(username1?.trim()) || !(username2?.trim()) || !(message?.trim())){
            return res.status(400).json({
                message:"Provide all required field!"
            })
        }

        const User1 = await User.findOne({username:username1});
        if(!User1){
            return res.status(404).json({
                message:"Provide correct username1 field!"
            })
        }

        const User2 = await User.findOne({username:username2});
        if(!User2){
            return res.status(404).json({
                message:"Provide correct username2 field!"
            })
        }

        const chatId1 = `${User1._id}${User2._id}`;
        const chatId2 = `${User2._id}${User1._id}`;

        const isChatExist = await Chat.findOne({
            $or: [
                { chatId: chatId1 },
                { chatId: chatId2 }
            ]
        });

        if(isChatExist){
            const existingChat = await Chat.findByIdAndUpdate(isChatExist._id , {
                $push: { allMessages:{sender:sender , message:message, time:dayjs(new Date() ).format('hh:mm A') } } ,
                lastMessage:message
                },
                { new: true } // Return the updated document
            )

            return res.status(200).json({
                message:"updated chat",
                chat:existingChat
            })
        }

        console.log(User1._id , User2._id)

        const newChat = new Chat({
            chatId:chatId1,
            userId1:User1._id,
            userId2:User2._id,
            username1:username1,
            username2:username2,
            lastMessage:message,
            allMessages: [
                {
                    sender: sender,
                    message: message,
                    timestamp: new Date(), // optional, as it defaults to `Date.now`
                    time:dayjs(new Date()).format('hh:mm A') 
                }
            ]
        })

        const createdChat = await newChat.save();

        if(!createdChat){
            return res.status(500).json({
                message:"Something went wrong while creating a new chat!"
            })
        }

        return res.status(201).json({
            message:"Chat created successfully",
            chat:createdChat,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Something went wrong while creating a new chat between two users!",
            error:error,
        })
    }
}

export async function updateChatByChatId({chatId , message , sender}){
    try {
        // const {chatId , message , sender} = req.body;

        if(!(chatId?.trim()) || !(message?.trim()) || !(sender?.trim())){
            return{
                message:"Provide all required field!"
            }
        }
        console.log(chatId, message , sender);
        const existingChat = await Chat.findById(chatId);
        console.log(existingChat);
        if(!existingChat){
            return {
                message:"no such chat exist"
            }
        }
        const chatToBeUpdated = await Chat.findByIdAndUpdate(existingChat._id ,
            {
                $push :{ allMessages : {sender:sender , message:message, time:dayjs(new Date() ).format('hh:mm A') }},
                lastMessage:message,
            },
            {new:true}
        )

        if(!chatToBeUpdated){
            return {
                message:"Something went wrong while updating chat!",
            }
        }

        return {
            message:"chat updated successfully",
            chat : chatToBeUpdated,
        }
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function getUserChats(req,res){
    try {
        const {username} = req.body;


        if(!(username?.trim())){
            return res.status(400).json({
                message:"Provide username"
            })
        }

        const user = await User.findOne({username:username});
        if(!user){
            return res.status(404).json({
                message:"Provide correct username field!"
            })
        }

        const userChats = await Chat.find({
            $or: [
                { username1: username },
                { username2: username }
            ]
        })

        return res.status(200).json({
            message: "all chats of user",
            chats:userChats
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong while fething user chats!"
        })
    }
}

export async function getChatById(req,res){
    try {

        const {chatId} = req.body;

        const existingChat = await Chat.findById(chatId);
        console.log(existingChat);
        if(!existingChat){
            return res.status(404).json({
                message:"no such chat exist",
            })
        }

        return res.status(200).json({
            message:"Got the chat",
            chat : existingChat,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong while fething chat!"
        })
    }
}