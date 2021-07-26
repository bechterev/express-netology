const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');


router.get('/login',(req,res)=>{
    res.render('user/login',{title: "Login"});
});
router.post('/login',
passport.authenticate(
    'local',
    {
      failureRedirect: '/user/login',
    },
  ),
  function (req, res) {
    console.log("req.user: ", req.user)
    res.redirect('/')
  });
router.get('/signup',(req,res)=>{
    res.render('user/signup',{title:'Sign In'});
})
router.post('/signup',async(req,res)=>{
    console.log(req.body);
    const {login,email,pass,pass_repeat} = req.body;
    if(pass !== pass_repeat) {res.status(404).json(`passwords not compare`); return}
    let user = await User.findOne({login:login, email:email});
    if(user!==null) {res.status(404).json(`login or email has`);
    return}
    const hash = await genPass(pass);
    const newUser = new User({login:login, email: email, password:hash});
    try{
        await newUser.save();
        res.status(200).json(`add new user`);
    }
    catch(err){
        res.status(404).json(`user not add because error: ${err}`);
        
    }
    
})
router.get('/me',/* async(req,res)=>{
    
    const user = req.cookies;
    try{
        console.log(user,'uid')
        const user = await User.findById(user._id);
        res.render('user/profile',{title:'Profile', user:user})
    }
    catch(err){
        res.status(404).json('information not found');
    }
}*/  function (req, res, next) {
    console.log(req.session,'ses')
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
          req.session.returnTo = req.originalUrl || req.url
        }
        return res.redirect('/login')
      }
      next()
    },
    function (req, res) {
      res.render('profile', { user: req.user })
    }
)
async function genPass(pass){
    const saltRound = 10;
    return await bcrypt.hash(pass, saltRound);
}
module.exports = router;
