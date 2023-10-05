const UserModel=require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken')
const cookie=require('cookie');

exports.getregister = async(req,res)=>{
  console.log('Received POST request to /register');
  console.log('Request body:', req.body);
  const { name, email, password } = req.body;

try {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(400).send('User with this email already exists.');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = new UserModel({ name, email, password: hashedPassword });
  // const token= await newUser.generateauthtoken();
  // console.log("token"+token);
  // //const date = new Date();
  // res.cookie("jwt",token, {
  //   expires: new Date(Date.now()+ 300000),
  //   httpOnly : true
  // });
  // //console.log("cookie: "+cookie);
  await newUser.save();
  res.redirect('/login');
} catch (error) {
  console.error('Error registering user:', error);
  res.status(500).send('Internal Server Error');
}
}

exports.getlogin = async(req,res)=>{
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(401).send('Invalid email or password.');
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      const token= jwt.sign({_id: user._id},process.env.SECRET_KEY);
      console.log("token"+token);
      res.cookie("jwt",token, {
        expires: new Date(Date.now()+ 300000),
        httpOnly : true
      });
      //console.log("cookie: "+cookie);
      //console.log("Cookie set:", req.cookies);

      if (!passwordMatch) {
        return res.status(401).send('Invalid email or password.');
      }
      req.session.user = user;
      res.redirect('/profile');
    } catch (error) {
      console.error('Error logging in:', error);
      res.status(500).send('Internal Server Error');
    }
}

exports.getProfile= async(req,res)=> {
  const user = req.session.user;

  if (!user) {
    res.redirect('/login');
  } else {
    res.render('profile', { user });
  }
}

exports.logout = (req, res) => {
  try {
    // Clear the JWT cookie by setting its expiration to a past date
    res.cookie('jwt', '', {
      expires: new Date(0),
      httpOnly: true,
    });

    // Optionally, you can clear the user session as well
    req.session.user = null;

    // Redirect the user to a logout success page or any other appropriate page
    res.redirect('/login');
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.geteditprofile= async(req,res)=> {
  res.render('edit-profile', { user: req.session.user });
}

exports.editProfile= async(req,res)=> {
  try {
    // Ensure that req.user is a valid Mongoose user model instance
    if (!req.session.user) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    // Update user details
    req.session.user.name = req.body.name;

    // Save the updated user data to the database
    await UserModel.findByIdAndUpdate(req.session.user._id, { name: req.body.name });

    // Redirect or respond as needed
    res.redirect('/profile');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user details' });
  }
}
