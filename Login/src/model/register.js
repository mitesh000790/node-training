const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const empRegister = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true,
            unique:[true,"This Email is alreadt Exist"]
        },
        password:{
            type:String,
            required:true
        },
        confpassword:{
            type:String,
            required:true
        },
        tokens:[{
            token:{
                type:String,
                required:true
            }
        }]
    }
)

//generate token

empRegister.methods.generateAuthToken = async function(){
    
    try {
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token})
        await this.save();
        return token;
    } catch (error) {
        console.log(error)
    }
}

//converting password into hash
empRegister.pre("save",async function(next){

    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
        this.confpassword = await bcrypt.hash(this.confpassword,10)
    }
    next();
   
})

const Register = new mongoose.model("Register", empRegister);

module.exports = Register;