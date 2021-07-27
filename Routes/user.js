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
        
        res.redirect('/user/login')
    }
    catch(err){
        res.status(404).json(`user not add because error: ${err}`);
        
    }
    
})
router.get('/me',function (req, res, next) {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        if (req.session) {
          req.session.returnTo = req.originalUrl || req.url
        }
        
      }
      next()
    },
     function (req, res) {
      try{
        User.findById(req.session.passport.user).then(user=>{
        res.render('user/profile',{title:'Profile', user:user})
       })
      }
      catch(err){
        console.log(err);
        return res.redirect('/user/login')
      }
    }
)
async function genPass(pass){
    const saltRound = 10;
    return await bcrypt.hash(pass, saltRound);
}
module.exports = router;
