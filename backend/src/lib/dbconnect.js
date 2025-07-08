import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config();

const dbConnect=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to MongoDB : ${conn.connection.host}`);
    } catch (error) {
        console.log("Error occured while connecting to DB : ",error);
    }
}

export default dbConnect;