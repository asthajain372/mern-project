const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt =  require("jsonwebtoken");
const { response } = require("express");


const employeeSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        validator(value){
            if(!validator.isemail(value)){
                throw new Error ("Invalid email id")
            }
        }
    },
   
    phone:{
        type:Number,
        required:true,
        // unique:true
    },
    age:{
        type:Number,
        required:true
    },
    password :{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
        required:true
        }
    }]
})
// generating the tokens
employeeSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        // console.log(token);
        this.tokens = this.tokens.concat({token:token});
        await this.save(); 
        return(token);
    } 
     catch(error){
     res.send(error);  
     console.log("error part");
       
    }
}

//middleware convert the passworg into hash 
employeeSchema.pre("save",async function(next){

    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
        this.confirmpassword=await bcrypt.hash(this.password, 10);

        // this.confirmpassword=undefined;
    }
    next();
})
//now we need to create a collections

const Register = new mongoose.model("Register",employeeSchema);

module.exports = Register;