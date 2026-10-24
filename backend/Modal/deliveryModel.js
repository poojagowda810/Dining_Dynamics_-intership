const mongoose=require('mongoose')


const DeliverySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },  
    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'active'
    }

},{timestamps:true})

module.exports=mongoose.model("delivery",DeliverySchema)
