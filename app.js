require('dotenv').config();
const express = require('express');
const port= 8080;
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//const db=require('./config/db')

const userrouter=require('./routes/user');
const shoprouter=require('./routes/books');
const cartRouter=require('./routes/cart');



mongoose.connect('mongodb://127.0.0.1:27017/Users') //database name
mongoose.connection.on('connected',()=>{
  console.log("connected successfully")
})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'view'));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: '5tg6789efddv', resave: false, saveUninitialized: false }));

app.use('/',userrouter);
app.use('/shop',shoprouter)
app.use('/cart',cartRouter);

app.listen(port,function(err){
    if(err){
        console.log("Error is running on server");
    }
    console.log(`Server is running on port ${port}`);
})