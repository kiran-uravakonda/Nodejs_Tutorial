import mongoose from "mongoose";
import fs from 'fs';
import validator from 'validator'
let movieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name field is required"],
        unique:true,
        trim:true,
        minLength:[2,'minimum length of the movie name is 2'],
        maxLength:[100,'maximum length of the movie name is 100'],
        validate:[validator.isAlpha,"name of the movie should contain only alphabets"]
    },
    description:{
        type:String,
        required:[true,"description field is required"],
        trim:true
    },
    duration:{
        type:Number,
        required:[true,"duration field is required"]
    },
    ratings:{
        type:Number,
        validate:{
            validator: function(value){
                return value>=1 && value<=10;
            },
            message: `its ({VALUE}), but Ratings should be above 1 and below 10`
        }
    },
    totalRating:{
        type:Number,
    },
    releaseYear:{
        type:Number,
        required:[true,"releaseYear field is required"]
    },
    releaseDate:{
        type:Date
    },
    creditedAt:{
        type:Date,
        default:Date.now()
    },
    genres:{
        type:[String],
        required:[true,"gerns field is required"]
    },
    directors:{
        type:[String],
        required:[true,"directors field is required"]
    },
    coverImage:{
        type:String,
        required:[true,"coverImage field is required"]
    },
    actors:{
        type:[String],
        required:[true,"actors field is required"]
    },
    price:{
        type:Number,
        required:[true,"price field is required"]
    },
    createdBy:String
    
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
movieSchema.virtual('durationInHours').get(function(){
    return this.duration / 60
})

//document middleware
movieSchema.pre('save',function(next){
    this.createdBy="kiran"
    // console.log(this)
    next();
})

movieSchema.post('save',function(doc,next){
    let content=`the movie ${doc.name} is created by the ${doc.createdBy}`
   fs.writeFileSync('./Logs/logs.txt',content,(err)=>{
    console.log(err.message)
   })
    next();
})

//query middleware

movieSchema.pre(/^find/, function(next){
    this.find({releaseDate: {$lte: Date.now()}});
    this.startTime = Date.now();
    next();
});


movieSchema.post(/^find/, function(docs, next){
    this.find({releaseDate: {$lte: Date.now()}});
    this.endTime = Date.now();
    const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the documents.`
    fs.writeFileSync('./Logs/logs.txt', content, {flag: 'a'}, (err) => {
        console.log(err.message);
    });

    next();
});

//aggregate middleware
movieSchema.pre('aggregate', function(next){
    console.log(this.pipeline().unshift({ $match: {releaseDate: {$lte: new Date()}}}));
    next();
});

let Movie= mongoose.model('Movie',movieSchema);
export default Movie;