require('dotenv').config()
const mongoose=require("mongoose");
const jwt=require('jsonwebtoken');
const userSchema= new mongoose.Schema({
    name: String,
    email: String,
    password:String,
    // tokens:[{
    //     token:{
    //         type: String,
    //         required: true
    //     }
    // }]
});

// userSchema.methods.generateauthtoken = async function() {
//     try {
//         const token1= jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY);
//         //console.log(token);
//         this.tokens=this.tokens.concat({token:token1})
//         await this.save();
//         return token1;
//     }
//     catch(error)
//  {
//     res.send("the Error part"+error);
//  }}

module.exports=mongoose.model('User',userSchema);