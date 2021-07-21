const express = require('express');
const cors = require('cors');



const bookApiRouter = require('./Routes/api/books');
const userApiRouter = require('./Routes/api/users');
const bookRouter = require('./Routes/books');
const userRouter = require('./Routes/users');
const indexRouter = require('./Routes/index');
const mongoose = require('mongoose');




const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cors());

app.use('/', indexRouter)
app.use('/books', bookRouter);
app.use('/users', userRouter);
app.use('/api/book', bookApiRouter);
app.use('/api/user', userApiRouter);

app.set('view engine', 'ejs');
app.use(express.static("public/img"))

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