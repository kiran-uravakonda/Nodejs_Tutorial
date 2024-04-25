import mongoose from "mongoose";

let connectDB=async(req,res)=>{
    try{
        await mongoose.connect(process.env.CONNECT_DB);
        console.log("database connected successfully")
    }
    catch(error){
         console.log(error.message)
    }
}

export default connectDB;