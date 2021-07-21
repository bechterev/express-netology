const { Router } = require('express');
const fs = require('fs');
const express = require('express');
//const Book = require('../models/entity');
const Book = require('../models/books');
const router = express.Router();
const fileMW = require('../middleware/file');
//const redis = require('redis');

/*const REDIS_URL = process.env.REDIS_URL ;
let client;
if(REDIS_URL)
 client = redis.createClient(`redis://${REDIS_URL}`);
 else client =redis.createClient();
*/
/*const listBook = [];
[1, 2, 3].map(el => {

    const book = new Book({
        title: `book ${el}`, description: `max interesting book`,
        authors: `author ${el}`, favorite: '', fileCover: '', fileName: ''
    });
    listBook.push(book)
});*/

router.get('/',async (req, res) => {
    const list = await Book.find();
    console.log(list);
    res.render("books/index", {
        title: "Books",
        books: list
    })
});

router.get('/create', (req, res) => {

    res.render("books/create", {
        title: "Books | create",
        book: {}
    })
});

router.post('/create', fileMW.single('filecover'), async (req, res) => {
    
    const { title, description, authors, favorite } = req.body;
    let path, filename;
    console.log(req)
    if (req.file) {
        path = req.file.path;
        filename = req.file.filename;
    }
    const newBook = new Book({
        title: title===undefined?'':title, description: description===undefined?'':description,
        favorite: favorite===undefined?'':favorite, authors:authors===undefined?'':authors,
        fileCover: path !== undefined ? path : '', fileName: filename !== undefined ? filename : ''
    });
    try{ await newBook.save();
        res.redirect('/books')}
        catch(err){
            res.status(404).json(`erorr db: ${err}`)
        }
   
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id,'this id')
    const book = await Book.findById(id);
   
    if (book !== undefined) {
        let count =0;
        res.render("books/view", {
            title: "Book | view",
            book: book,
            counter: count
        })
       /*  client.incr(id, (err,rep)=>{
            if(err){
                res.status(500).json({err:`redis main error: ${err}`});
            }
            else { 
                count = rep;
                res.render("books/view", {
                    title: "Book | view",
                    book: book,
                    counter: count
                })
            
        }
        })*/

    }
    else {
        res.status(404);
        res.json('book not found');
    }
});

router.get('/update/:id', async(req, res) => {
    const { id } = req.params;
    console.log(id)
    const bookParam = req.body;
    let search_book = await Book.findById(id);
    if (search_book !== undefined) {
        res.render("books/update", {
            title: "Book | update",
            book: search_book
        })
    }
    else {
        res.status(404).redirect('/404');
    }
});
router.post('/update/:id', fileMW.single('filecover'), async(req, res) => {
    const { id } = req.params;

    const { title, description, authors, favorite } = req.body;
    
        let ind = {};
        if (req.file) {
            ind.fileCover = req.file.path;
            ind.fileName = req.file.filename;
        } 
        if(title!==undefined) ind.title = title;
        if(description!==undefined) ind.description = description;
        if(authors!==undefined) ind.authors = authors;
        if(favorite!==undefined) ind.favorite= favorite;
        try{
            console.log(id, ind)
            await Book.findByIdAndUpdate({_id:id}, ind);
            res.redirect(`/books/${id}`);
        }
       catch(err){
        res.status(404).redirect('/404');
       }
    
})
    router.post('/delete/:id',async (req, res) => {
        const { id } = req.params;
       
        try{
            let search = await Book.findById(id);
            await Book.deleteOne({_id:id});
            if (search) {
                const path = search.fileCover;
                if (!!path) {
                    fs.unlink(path, () => {
                        res.redirect(`/books`);
                    })
    
                }
                else {
                    res.redirect(`/books`);
                }
            }
            
        }
        catch(err){
            res.status(404).redirect('/404');
        }
    })
    module.exports = router;