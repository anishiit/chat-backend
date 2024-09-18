import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema(
    {
        chatId:{
            type:String,
            unique:true,
            required:true,
        },
        username1:{
            type:String,
            required:true,
        },
        username2:{
            type:String,
            required:true,
        },
        userId1:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true,
        },
        userId2:{
            type:mongoose.Types.ObjectId,
            ref:"User",
            required:true,
        },
        allMessages: [
            {
                sender:{
                    type:String,
                    required:true,
                },// Who sent the message
                message: String, // Message content
                timestamp: { type: Date, default: Date.now }, // Timestamp
                time:{type : String }
            }
        ],
        lastMessage:{type:String},
    },
    {timestamps : true}
)

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;