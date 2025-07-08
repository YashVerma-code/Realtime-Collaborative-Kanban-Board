import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String,
        default:""
    },
    tasks:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }
},{timestamps:true});

const User=mongoose.models.User || mongoose.model("User",userSchema);

export default User;