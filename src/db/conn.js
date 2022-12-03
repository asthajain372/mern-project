const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/stu_registered",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`connection successful...`);
}).catch((e)=>{
    console.log(`no comnection`);
})