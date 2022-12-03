require('dotenv').config();
const express = require("express");
// const { dirname } = require("path");
const path = require("path");
const hbs = require("hbs");
const { registerPartials } = require("hbs");
const app = express();
const bcrypt = require("bcryptjs");
const jwt =  require("jsonwebtoken");
const cookieparser = require("cookie-parser");
const auth =  require("./middleware/auth");

const port = process.env.PORT || 3000;
require("./db/conn");
const Register = require("./models/register");
const User = require("../../my_project/src/models/userdata");

const static_path = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


app.get("/", (req, res) => {
    res.render("index");
})

app.get("/secret", auth , (req, res) => {
    // console.log(`this is cookie ${req.cookies.jwt}`); 
    res.render("secret");
})

app.get("/logout", auth , async(req, res) => {
    try{
        // console.log(req.user);

        //logout from the single device

        // req.user.tokens = req.user.tokens.filter((currElement)=>{
        //     return currElement.token !== req.token
        // })

        //logout from the multiple devices
        req.user.tokens = [];

        res.clearCookie("jwt");
        // console.log("logout successfully...") ;
        await req.user.save();
        
        res.render("logi");
    }
    catch(error){
        res.status(500).send(error);
    } 
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.get("/contactus", (req, res) => {
    res.render("contactus");
})

// ...................register page...........................


app.post("/register", async(req,res) => { 
try{

    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if(password === confirmpassword){

        const registerEmployee = new Register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            phone:req.body.phone,
            age:req.body.age,
            email:req.body.email,
            gender:req.body.gender,
            password:req.body.password,
            confirmpassword:req.body.confirmpassword
        })
        const token = await registerEmployee.generateAuthToken();
        res.cookie("jwt",token),{
            // expires:new Date(Date.now() + 30000000),
            httpOnly:true
        }

        const registered = await registerEmployee.save();
        res.status(201).render("index");
    
    }
    else{
        res.send("password are not matching")
    }

}
catch(error){
    res.status(500).send("error");
    console.log("error part page");
    
}
})

// .....................for contactus page...................................


app.post("/contactus",async(req,res)=>{
    try{
    //    res.send(req.body);
        const userDat = new User(req.body);
        await userDat.save();
        res.status(201).render("index");

    }catch(error){
        res.status(500).send(error);
    }
})

// .......................login page................................


app.get("/logi", (req, res) => {
    res.render("logi");
})
app.post("/logi" , async(req,res)=>{
    try{
        const email = req.body.email;
        const password =req.body.password;

        const useremail = await Register.findOne({email:email});

        const isMatch = await bcrypt.compare(password,useremail.password);
         
        const token = await useremail.generateAuthToken();
          
        res.cookie("jwt",token),{
            // expires:new Date(Date.now() + 30000000),
            //secure:true used after hosting
            httpOnly:true
        }

        if(isMatch){
            res.status(201).render("index");
        }else{
            res.send("invalid credential");
        }
    }
    catch(error){
        res.status(400).send("invalid email");
    }
})

 

app.listen(port, () => {
    console.log(`sever is at ${port}`)
})