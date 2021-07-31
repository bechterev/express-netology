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
const http = require('http');
const socketIO = require('socket.io');


function verify(username, password, done) {
    User.findOne({login:username},function(err, user){
      if(user === null) {return done(null,false,{message:`user not found`});
      }
      if(bcrypt.compareSync(password, user.password)){
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
  console.log('ser', user.id)
   cb(null, user.id)
})

passport.deserializeUser(function (id, cb) {
  console.log(id, 'deser');
  User.findById(id).then(data=>{
    if(data===null) return cb(null);
    else return cb(null, id)
 });

})

const app = express();
const server = http.Server(app);
const io = socketIO(server);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
const sessionMiddleware= session({
  secret: 'user',
  resave: false,
  saveUninitialized: false,
})
app.use(sessionMiddleware)
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(passport.initialize());
app.use(passport.session());
io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()))
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error('unauthorized'))
  }
});
app.set('view engine', 'ejs');
app.use(express.static("public/img"))
app.use('/', indexRouter)
app.use('/user', userRouter);



app.use('/books', bookRouter);
app.use('/listuser', usersRouter);
app.use('/api/book', bookApiRouter);
app.use('/api/user', userApiRouter);
app.use(cors());


io.on('connection', (socket)=>{
  const {id} = socket;
  
  socket.on('whoami', (cb) => {
    cb(socket.request.user ? socket.request.user.username : '');
  });

  const session = socket.request.session;

  session.socketId = socket.id;
  session.save();
    // работа с комнатами
    const {roomName} = socket.handshake.query;
    
    socket.join(roomName);
    socket.on('message-to-room', async (msg) => {
        var user = await User.findById(socket.request.session.passport.user);
        msg.username = user.login;
        msg.type = `room: ${roomName}`;
        socket.to(roomName).emit('message-to-room', msg);
        socket.emit('message-to-room', msg);
    });
  socket.on('disconnect',(socket)=>{
    console.log(`Socket disconnection ${id}`);
  })
})


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
    server.listen(PORT, () => {
      console.log(`app start from port ${PORT}`)
    });
  }
  catch (err) {
    
    console.log(err);

  }
}
init()