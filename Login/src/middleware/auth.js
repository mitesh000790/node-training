const Register = require('../model/register')
const jwt = require('jsonwebtoken');


const auth = async (req,res,next) =>{

    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verifyUser);
        next()

        const user = await Register.find({_id:verifyUser._id});
        console.log(user)

        req.token = token;
        req.user = user;
    } catch (error) {
        res.status(401).send(error)
    } 
}

module.exports = auth;