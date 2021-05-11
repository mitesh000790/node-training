const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/registration',{
    useFindAndModify:false,
    useUnifiedTopology:true,
    useNewUrlParser:true,
    useCreateIndex:true
}).then(()=>{
    console.log("connection successfully")
}).catch((e)=>{
    console.log(e)
})