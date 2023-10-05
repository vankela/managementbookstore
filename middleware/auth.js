require('dotenv').config();
const jwt= require('jsonwebtoken');
const userSchema=require('../model/userModel');


    const auth = (req, res, next) => {
      const token = req.cookies.jwt;    
      if (!token) {
        return res.redirect('/login');
      }
    
      jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = decoded; 
        next();
      });
    };
    
    module.exports = auth;
