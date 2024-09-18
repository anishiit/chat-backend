import mongoose, { Schema } from "mongoose";

const groupChatScema = new Schema(
    {
        groupname:{
            type:String,
            required:true,
        },
        groupmembers:[
            {
                type:String,
                required:true
            }
        ],
        groupadmins:[
            {
                type:mongoose.Types.ObjectId,
                ref:"User",
            }
        ],
        allMessages:[
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
        createdBy:{
            type:String,
            required:true,
        }
    },
    {timestamps:true}
)

const Groupchat = mongoose.model("Groupchat" , groupChatScema);

export default Groupchat;