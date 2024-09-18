import User from "../models/user_model.js";
import Groupchat from "../models/groupchat_model.js";
import dayjs from "dayjs";
import Chat from "../models/chat-model.js";

export async function createGroupChat(req, res){
    try {
        const {groupname , groupmembers , createdBy } = req.body;
        // console.log(groupmembers);

        const creater = await User.findOne({username:createdBy});
        if(!creater){
            return res.status(404).json({
                message:"createdBy is not found!"
            })
        }
        // console.log(creater)

        const createdGroupchat = await Groupchat.create({
            groupname:groupname,
            groupmembers:[...groupmembers, createdBy],
            createdBy:createdBy,
        })

        if(!createdGroupchat){
            return res.status(500).json({
                message:"Something went wrong while creating Group!!"
            })
        }
        // console.log(createGroupChat)

        const updation  = await User.findOneAndUpdate({username:createdBy}, 
            {$push : { groups:createdGroupchat._id }},
            {new:true}
        )

        const isSuccess = await Promise.all[ groupmembers.map(async (member) => {
            const updation  = await User.findOneAndUpdate({username:member}, 
                {$push : { groups:createdGroupchat._id }},
                {new:true}
            )
            // console.log(updation);
            if(!updation) return false;
        }
        )]
        
        return res.status(201).json({
            message:"Group created successfully",
            group:createdGroupchat,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Something went wrong while creating Group!",
            error:error,
        })
    }
}

export async function pushNewMessageInGroup(req,res){
    try {
        const {groupId, message, sender} = req.body;
        if(!(groupId?.trim()) || !(message?.trim()) || !(sender?.trim())){
            return res.status(400).json({
                message:"Provide all required field!"
            })
        }
        // console.log(groupId)

        const group = await Groupchat.findById(groupId);
        if(!group){
            return res.status(404).json({
                message:"Provide correct groupId field!"
            })
        }

        const updateGroupchat = await Groupchat.findByIdAndUpdate(groupId , {
            $push: { allMessages:{sender:sender , message:message, time:dayjs(new Date() ).format('hh:mm A') } } ,
            lastMessage:message
            },
            { new: true } // Return the updated document
        )

        if(!updateGroupchat){
            return res.status(500).json({
                message:"Something went wrong while pushing a message in the group!",
            })
        }

        return res.status(200).json({
            message:"updated group-chat",
            groupchat:updateGroupchat
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"Something went wrong while pushing a message in the group!",
            error:error,
        })
    }
}

export async function updateGroupChatById({groupId, message, sender}){
    
    try{
        if(!(groupId?.trim()) || !(message?.trim()) || !(sender?.trim())){
            return res.status(400).json({
                message:"Provide all required field!"
            })
        }
        // console.log(groupId)
    
        const group = await Groupchat.findById(groupId);
        if(!group){
            return {
                message:"Provide correct groupId field!"
            }
        }
    
        const updateGroupchat = await Groupchat.findByIdAndUpdate(groupId , {
            $push: { allMessages:{sender:sender , message:message, time:dayjs(new Date() ).format('hh:mm A') } } ,
            lastMessage:message
            },
            { new: true } // Return the updated document
        )
    
        if(!updateGroupchat){
            return {
                message:"Something went wrong while pushing a message in the group!",
            }
        }
        console.log(updateGroupchat)
    
        return {
            message:"updated group-chat",
            chat:updateGroupchat
        }
    } catch (error) {
        console.log(error)
        return {
            message:"Something went wrong while pushing a message in the group!",
            error:error,
        }
    }  
}

export async function getGroupChatByGroupId(req,res){
    try {

        const {groupId} = req.body;

        const existingChat = await Groupchat.findById(groupId);
        console.log(existingChat);
        if(!existingChat){
            return res.status(404).json({
                message:"no such group-chat exist",
            })
        }

        return res.status(200).json({
            message:"Got the group-chat",
            groupChat : existingChat,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Something went wrong while fething group-chat!"
        })
    }
}

export async function getUserGroups(req, res){
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

        const groups = await Groupchat.find({ _id: { $in: user.groups }})

        return res.status(200).json({
            message:"Got user groups",
            groups:groups,
        })
    
   } catch (error) {
    console.log(error);
    return res.status(500).json({
        message:'Something went wrong while fetching user groups!',
        error:error
    })
   } 
}

export async function exitGroupChat(req , res){

}

export async function deleteGroupChat(req,res){

}