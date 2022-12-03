const mongoose = require ("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
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
        type:String,
        required:true,
        min:10
    },
    message:{
        type:String,
        required:true,
        minLength:3
    }
})
//we need a collection 
const User = new mongoose.model("user",userSchema);
module.exports = User;
