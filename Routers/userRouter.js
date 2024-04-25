import express from 'express';
let userRouter=express.Router();
import {userSignup,loginUser,forgotPassword} from  '../Controllers/userController.js';
userRouter.post('/api/v1/users/signup',userSignup)
userRouter.post('/api/v1/users/login',loginUser)
userRouter.post('/api/v1/users/forgotPassword',forgotPassword)

export default userRouter;