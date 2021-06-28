const express = require('express');
const cors = require('cors');
const formData = require('express-form-data');
const  Book  = require('./entity');
const listBook = [];

[1,2,3].map(el=>{
    
    const book = new Book({title: `book ${el}`, description: `max interesting book`,
    authors: `author ${el}`, favorite:'', fileCover:'', fileName: ''});
    listBook.push(book)
});

const app = express();

app.use(formData.parse());
app.use(cors());

app.get('/api/books/', (req, res)=>{
    res.json(listBook);
})
app.get('/api/books/:id',(req,res)=>{
    const {id} = req.params;
    const book = listBook.find(el => el.search_id(id));
    if(book !== undefined){
        res.json(book);
    }
    else {
        res.status(404);
        res.json('book not found');
    }
});
app.post('/api/books/', (req, res)=>{
    const { title, description,
        authors,favorite, fileCover,
        fileName  } = req.body;
    const newBook = new Book({title:title,
    description:description, favorite: favorite,
fileCover:fileCover, fileName:fileName});
    listBook.push(newBook);

    res.status(201);
    res.json(newBook);
})

app.put('/api/books/:id',(req, res)=>{
    const {id} = req.params;
    console.log(id)
    const bookParam = req.body;
    let search_book = listBook.find(el => el.search_id(id));
    if(search_book!==undefined){
        search_book.update(bookParam);
        res.json(search_book);
    }
    else{
        res.status(404);
        res.json("book not found");
    }
});
app.delete('/api/books/:id',(req, res)=>{
    const {id} = req.params;
    const ind = listBook.findIndex(el=>el.search_id(id));
    if(ind!==-1){
        listBook.splice(ind,1);
        res.json(`delete book`);
    }
    else {
        res.status(404);
        res.json('book not found');
    }
});

app.get('/api/user/login',(req,res)=>{
    const user = {id:1, mail:"test@mailru"};
    res.json(user);
})
const port = 3000;

app.listen(port, ()=>{
    console.log(`app start from port ${port}`)
})