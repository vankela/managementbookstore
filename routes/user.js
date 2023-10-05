const express=require('express');
const router=express.Router();
const userController=require('../controller/userController');
const cookieParser = require('cookie-parser');
const auth=require('../middleware/auth');

router.use(cookieParser());
router.get('/register', (req, res) => {
  res.render('register'); 
});

router.post('/getregister', userController.getregister);

router.get('/login', (req, res) => {
  res.render('login'); 
});

router.post('/getlogin', userController.getlogin);
router.get('/profile',auth,userController.getProfile);
router.get('/edit-profile',auth,userController.geteditprofile);
router.post('/edit-profile', auth, userController.editProfile);
router.get('/logout',auth,userController.logout);

module.exports=router