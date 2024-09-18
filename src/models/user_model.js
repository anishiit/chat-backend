import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username:{
            type:String,
            unique:true,
            required:true,
        },
        email:{
            type:String,
            unique:true,
            required:true,
        },
        password:{
            type:String,
            required:true,
        },
        connectedUsers:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }],
        groups:[
            {
                type:mongoose.Types.ObjectId,
                ref:"Groupchat"
            }
        ]
    },
    {timestamps : true}
)

const User = mongoose.model("User", userSchema);

export default User;