import User from "../models/user_model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;
    // console.log(req.body);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword });
    if(!user){
      return res.status(500).json({ error: 'Error registering user' });
    }

    return res.status(201).json({ message: 'User registered successfully', username:username, userId:user._id });
  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Error registering user' });
  }
};
  
// Login endpoint => checked 
export async function loginUser(req, res){
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  
    return res.json({ token, userId: user._id, username: user.username });
  } 
  catch (error) {
      console.log(error);
    res.status(500).json({ error: 'Error logging in' });
  }
};

export async function getUser(req, res) {
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
    return res.status(200).json({
      message:"Got user data",
      user : user,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"something went wrong while fething user data!",
      error:error,
    })
  }
}

export async function getAllUsers(req,res){
  try {  
    const allUsers = await User.find();
    console.log(allUsers);
    return res.status(200).json({
      message:"Got all users",
      allUsers:allUsers,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:"something went wrong while fething all users",
      error:error,
    })
  }
}

export async function searchUser(req , res){
  const { searchQuery } = req.body;

    try {
        const users = await User.find({
            username: { $regex: searchQuery, $options: 'i' } // 'i' makes the search case-insensitive
        });

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: 'Error searching users' });
    }
}