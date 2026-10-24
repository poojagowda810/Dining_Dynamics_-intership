const userSchema = require('../../Modal/userModel')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
const key="Hello"

const UserRegister = async (req, res) => {
    try {
        const { name, email, phone, password, address } = req.body;
        // Check if the email already exists
        const existingUser = await userSchema.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email already exists' });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(password, salt);
        // Create a new user
        const newUser = new userSchema({ name, email, phone, password: secpass, address });
        const registeredUser = await newUser.save();
        // Respond with the registered user
        return res.json({ success: true, message: 'Registration successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const UserLogin=async(req,res)=>{
    try{
        const {email,password}=req.body;
        
        // Check normal users first
        let user=await userSchema.findOne({email});
        let isDelivery = false;
        
        // Fallback to delivery personnel
        if(!user){
            const DeliverySchema = require('../../Modal/deliveryModel');
            user = await DeliverySchema.findOne({email});
            if (!user) {
                return res.json({success:false,message:'Incorrect email or password'});
            }
            isDelivery = true;
        }
        
         const ismatch=await bcrypt.compare(password,user.password)
         if(!ismatch){
            return res.json({success:false,message:'Incorrect Password'})
         }
         
         const data=user.id
         const token=await jwt.sign(data,key)
         const success=true;
         const role = isDelivery ? 'delivery' : (user.role || 'user');
         
         res.json({token,success,role})
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false, message: 'Server error'});
    }
}


const GetOneUser = async (req, res) => {
    try {
        const ViewSingle= await userSchema.findById(req.user);
        res.send({ success: true, user: ViewSingle });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ success: false, message: "Internal server error occurred" });
    }
}

const GetUser = async (req, res) => {
    try {
        const users= await userSchema.find();
        res.send({success:true,user:users});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occurred");
    }
}



module.exports={UserRegister,UserLogin,GetOneUser,GetUser}