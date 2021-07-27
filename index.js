const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');
const bcrypt = require('bcrypt');
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


const bookApiRouter = require('./Routes/api/books');
const userApiRouter = require('./Routes/api/users');
const bookRouter = require('./Routes/books');
const usersRouter = require('./Routes/users');
const indexRouter = require('./Routes/index');
const userRouter = require('./Routes/user');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const User = require('./models/user');
const session = require('express-session');


function verify(username, password, done) {
    User.findOne({login:username},function(err, user){
      console.log(user,'23')
      if(user === null) {return done(null,false,{message:`user not found`});
      }
      if(bcrypt.compareSync(password, user.password)){
        console.log('proverka good')
          return  done(null,user);        
      }
      else{
      return  done(null, false,{message:`login or password failed`});
      }                    
    })
    

}

const options = {
  usernameField: 'login',
  passwordField: 'pass',
  passReqToCallback: false,
}

//  Добавление стратегии для использования
passport.use('local', new LocalStrategy(options, verify))

// Конфигурирование Passport для сохранения пользователя в сессии
passport.serializeUser(function (user, cb) {
   cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  
  User.findById(id).then(data=>{
    if(data===null) return cb(null);
    else return cb(null, id)
 });

})

const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(session({
  secret: 'user',
  resave: false,
  saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())
app.set('view engine', 'ejs');
app.use(express.static("public/img"))
app.use('/', indexRouter)
app.use('/user', userRouter);



app.use('/books', bookRouter);
app.use('/listuser', usersRouter);
app.use('/api/book', bookApiRouter);
app.use('/api/user', userApiRouter);






app.use(cors());


const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || 'root';
const PasswordDB = process.env.DB_PASSWORD || 'qwerty12345';
const NameDB = process.env.DB_NAME || 'library_db';
const HostDB = process.env.DB_HOST || 'mongodb://mongodb:27017/';
async function init() {
  try {
    await mongoose.connect(HostDB,{
      user:UserDB,
      pass:PasswordDB,
      dbName:NameDB,
      useNewUrlParser: true,
      useUnifiedTopology: true,

    })
    app.listen(PORT, () => {
      console.log(`app start from port ${PORT}`)
    })
  }
  catch (err) {
    
    console.log(err);

  }
}
init()