import data from '../Model/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import cookie  from 'cookie';

const jwtSign = userData => {
  return jwt.sign(JSON.stringify(userData), process.env.secrete_key)
}
export const userSignup = async (req, res) => {
  try {
    let newUSer = await data.create(req.body)
    let token = jwtSign(newUSer)
    res.status(200).json({ token: token, message: newUSer })
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
}


export const loginUser = async (req, res) => {
  try {

    let { email, password } = req.body
    let user = await data.findOne({ email })
    let token = jwtSign(user)
    let checkPassword = await bcrypt.compare(password, user.password || "")
    if (!user || !checkPassword) {
      res.status(400).json({ message: "Incorrect credentials" })
    }
    else {
      res.setHeader('Set-Cookie', cookie.serialize('jwt', token, {
        maxAge: 5000,
        secure: true,
        httpOnly: true,
        sameSite: 'strict' // Add this if needed for CSRF protection
      }));
      res.status(200).json({token:token, message: user })
    }



  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const protect=async(req,res,next)=>{
  try{
         let token;
         let bearerHeader=req.headers.authorization;
          if(!bearerHeader){
            res.status(300).json({message:"incorrect token provided"})
          } 
        

          token=bearerHeader.split(' ')[1];
          let verify=jwt.verify(token,process.env.secrete_key)
          let user = await data.findOne(verify)
         req.user=user
          if(verify){
    
            next()
          }
  }
  catch(error){
    res.status(401).json({message:error.message})
  }
}


export const restrict=(role)=>{
  return (req,res,next)=>{
       if(req.user.role!=role){
        res.status(400).json({message:'you are not an admin to delete the movies'})
       }
       next()
  }
}

export const forgotPassword=async(req,res)=>{
  try{
     let user=await data.findOne({email:req.body.email})
     if(!user){
      res.status(400).json({message:'can not find the user'})
     }

     let resetPassword= user.createResetPasswordToken();
     await user.save({validateBeforeSave:false})


  }
  catch(error){
res.status(400).json({message:error.message})
  }
}