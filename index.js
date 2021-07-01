const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const bookRouter = require('./Routes/books');
const userRouter = require('./Routes/users');



const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/book',bookRouter);
app.use('/api/user',userRouter);

const port = 3000;

app.listen(port, ()=>{
    console.log(`app start from port ${port}`)
})