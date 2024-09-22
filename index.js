import "dotenv/config"

import express from "express";
import http from "http";
import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import cors from "cors"
import { Server } from "socket.io";

import Chat from "./src/models/chat-model.js";
import { updateChatByChatId } from "./src/controllers/chat_controllers.js";
import { updateGroupChatById } from "./src/controllers/groupchat_controllers.js";

import userRouter from './src/routes/user_routes.js';
import chatRouter from './src/routes/chat_routes.js';
import groupChatRouter from "./src/routes/groupchat_routes.js";
import Groupchat from "./src/models/groupchat_model.js";
import chatBotRouter from "./src/routes/chatbot_route.js";

const app = express();
const server = http.createServer(app);


app.use(cors());
app.use(express.json({}));
app.use(express.urlencoded({extended:true}));


app.use('/api/user' , userRouter);

app.use('/api/chat' , chatRouter);

app.use('/api/groupchat' , groupChatRouter);

app.use('/api/chatbot' , chatBotRouter)


try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
} catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
}

const io = new Server(server, {
    pingTimeout: 180000,
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
})

io.on("connection", (socket) => {

    // console.log("User connected");
    // console.log("ID:", socket.id)

    socket.on('join_room', ({ roomId, userId }) => {
        socket.join(roomId) // join a unique room
        console.log(`user: ${userId} joined in room : ${roomId}`)
    });
    socket.on("typing", ({roomId , fromUserName}) => {
        // console.log('typing... ',{fromUserName})
        io.to(roomId).emit('typing',{fromUserName});
    });
    socket.on("online", ({roomId , fromUserName}) => {
        // console.log('online... ',{fromUserName})
        io.to(roomId).emit('online',{fromUserName});
    });
    socket.on("stop_typing", ({roomId }) => {
      console.log("stop typing..")
      io.to(roomId).emit('stop_typing', {roomId});
    })
    socket.on('send_message', async ({ message, roomId, fromUserName, fromUserId, isGroupChat }) => {
        // Broadcast message to everyone in the room (including sender)  
        // console.log(isGroupChat);
        if(isGroupChat === false){
            const chat = await updateChatByChatId({chatId:roomId, message:message , sender:fromUserName})
            io.to(roomId).emit('receive_message', { message, fromUserId, fromUserName, updatedChat:chat, isGroupChat });
        }
        else if(isGroupChat === true){
            const groupChat = await updateGroupChatById({groupId:roomId, message:message, sender:fromUserName});
            // console.log(groupChat)
            io.to(roomId).emit('receive_message', { message, fromUserId, fromUserName, updatedChat:groupChat, isGroupChat })
        }
    });

    socket.on("disconnect", () => {
        
        console.log(`user disconnected ${socket.id}`)
    })
})

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));