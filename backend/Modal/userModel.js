const mongoose=require('mongoose')


const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        // required:true
    },
    phone:{
        type:Number,
        // required:true
    },
    address:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        // required:true
    },
    password:{
        type:String,
        // required:true
    },  
    role:{
        type:String,
        enum:['user', 'admin', 'delivery'],
        default:'user'
    }

},{timestamps:true})

module.exports=mongoose.model("user",UserSchema)