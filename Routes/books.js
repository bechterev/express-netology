const { Router } = require('express');
const express = require('express');
const  Book  = require('../models/entity');
const router = express.Router();
const fileMW = require('../middleware/file');

const listBook = [];
[1,2,3].map(el=>{
    
    const book = new Book({title: `book ${el}`, description: `max interesting book`,
    authors: `author ${el}`, favorite:'', fileCover:'', fileName: ''});
    listBook.push(book)
});

router.get('/', (req, res)=>{
    res.json(listBook);
});

router.get('/:id',(req,res)=>{
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
router.post('/', fileMW.single('fileCover'),(req, res)=>{
    const { title, description, authors,favorite,  fileName  } = req.body;
    let path;
    if(req.file){
        path = req.file.path;
    }
    const newBook = new Book({title:title, description:description, favorite: favorite,
                              fileCover: path!==undefined?path:'', fileName:fileName});
    listBook.push(newBook);
    res.status(201);
    res.json(newBook);
})

router.put('/:id',(req, res)=>{
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
router.get('/:id/download',(req, res)=>{
    const {id} = req.params;
    console.log(id)
    const bookParam = req.body;
    let search_book = listBook.find(el => el.search_id(id));
    if(search_book!==undefined){
        console.log('downloa', __dirname+search_book.fileCover);
        res.download(__dirname+search_book.fileCover, 'cover.png', err=>{
            if (err){
                res.status(404).json();
            }
        });
    }
    else{
        res.status(404);
        res.json("book not found");
    }
});
router.delete('/:id',(req, res)=>{
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

module.exports = router;