import mongoose  from "mongoose";
import bcrypt from 'bcrypt'
import validator from "validator";
import crypto from 'crypto'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        validate:{
            validator:function(val){
                return val==this.password
            },
            message:'password and confirmPassword should be match'
        }
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    reserPasswordToken:String
})


userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()

    let salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt)
    this.confirmPassword=undefined;
    return next();
})


userSchema.methods.createResetPasswordToken=function(){
let resetToken=crypto.randomBytes(32).toString('hex')
this.reserPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex')
return resetToken
}

let user= mongoose.model('user',userSchema);
export default user;