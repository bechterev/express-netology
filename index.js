const express = require('express');
const cors = require('cors');



const bookApiRouter = require('./Routes/api/books');
const userApiRouter = require('./Routes/api/users');
const bookRouter = require('./Routes/books');
const userRouter = require('./Routes/users');
const indexRouter = require('./Routes/index');



const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
  }));
app.use(cors());

app.use('/',indexRouter)
app.use('/books',bookRouter);
app.use('/users',userRouter);
app.use('/api/book',bookApiRouter);
app.use('/api/user',userApiRouter);

app.set('view engine','ejs');
app.use(express.static("public/img"))

const port = 3000;

app.listen(port, ()=>{
    console.log(`app start from port ${port}`)
})