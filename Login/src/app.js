require('dotenv').config();
const express = require("express");
require('./db/conn');
const path = require('path');
const Register = require('./model/register');
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth")

const app = express();

const port = process.env.PORT || 8000;


app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

const static_path = path.join(__dirname,"../public");

app.use(express.static(static_path));
app.set("view engine","hbs")

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/secret",auth, (req,res)=>{
    // console.log(`hello this is secret page ${req.cookies.jwt}`)
    res.render("secret")
})

app.get("/logout",auth, async(req,res)=>{
    try {

        req.user.tokens = req.user.tokens.filter((currElem)=>{
            return currElem.token !== req.token
        })

        res.clearCookie("jwt");
        console.log("Logout successfully");

        await req.user.save();
        res.render("index")
    } catch (error) {
        res.status(501).send(error)
    }
    
})

app.get("/register",(req,res)=>{
    res.render("index")
})

app.get("/login",(req,res)=>{
    res.render("index")
})

app.post("/register",async(req,res)=>{
    try {

        const password = req.body.password;
        const cpassword = req.body.confpassword;

        if(password === cpassword){
            const registerEmployee = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
                confpassword: cpassword,
            })

            const token = await registerEmployee.generateAuthToken();

            res.cookie("jwt", token,{
                expires: new Date(Date.now() + 30000),
                httpOnly:true
            })

            const registerd = await registerEmployee.save();
            res.status(201).render("home");

        }else{
            res.status(401).send("password not match")
        }
        
    } catch (error) {
        console.log(error)
    }
})

app.post("/login",async(req,res)=>{
    try {

        const password = req.body.password;
        const email= req.body.email;
        
            const registerEmployee = await Register.findOne({email});
            const isMatch = await bcrypt.compare(password, registerEmployee.password);

            const token = await registerEmployee.generateAuthToken();
            console.log(token);

            res.cookie("jwt", token,{
                expires: new Date(Date.now() + 30000),
                httpOnly:true
            })
            
            if(isMatch){
                res.render("home")
            }else{
                res.status(401).send("invalid Login Detail")
            }
    } catch (error) {
        console.log(error)
    }
})

app.listen(port,()=>{
    console.log(`connection successfully on port ${port}`)
})
