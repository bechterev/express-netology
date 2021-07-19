const { Router } = require('express');
const fs = require('fs');
const express = require('express');
const Book = require('../models/entity');
const router = express.Router();
const fileMW = require('../middleware/file');
const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL ;
let client;
if(REDIS_URL)
 client = redis.createClient(`redis://${REDIS_URL}`);
 else client =redis.createClient();

const listBook = [];
[1, 2, 3].map(el => {

    const book = new Book({
        title: `book ${el}`, description: `max interesting book`,
        authors: `author ${el}`, favorite: '', fileCover: '', fileName: ''
    });
    listBook.push(book)
});

router.get('/', (req, res) => {
    const list = listBook;
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

router.post('/create', fileMW.single('filecover'), (req, res) => {
    const list = listBook;
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
    list.push(newBook);
    res.redirect('/books')
});
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const book = listBook.find(el => el.search_id(id));
    console.log(id,'this id')
    if (book !== undefined) {
        let count =0;
         client.incr(id, (err,rep)=>{
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
        })

    }
    else {
        res.status(404);
        res.json('book not found');
    }
});

router.get('/update/:id', (req, res) => {
    const { id } = req.params;
    console.log(id)
    const bookParam = req.body;
    let search_book = listBook.find(el => el.search_id(id));
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
router.post('/update/:id', fileMW.single('filecover'), (req, res) => {
    const { id } = req.params;
    const list = listBook;
    const { title, description, authors, favorite } = req.body;
    let ind = list.findIndex(el=>el.search_id(id))
    if (ind!=-1){
        if (req.file) {
            list[ind].fileCover = req.file.path;
            list[ind].fileName = req.file.filename;
        } 
        list[ind].title = title===undefined?list[ind].title:title;
        list[ind].description = description===undefined?list[ind].description:description;
        list[ind].authors = authors===undefined?list[ind].authors:authors;
        list[ind].favorite = favorite===undefined?list[ind].favorite:favorite;
        res.redirect(`/books/${id}`);
    }

    else{
        res.status(404).redirect('/404');
    }
})
    router.post('/delete/:id', (req, res) => {
        const { id } = req.params;
        const list = listBook;
        let search = listBook.findIndex(el => el.search_id(id));

        if (search != -1) {
            let search_book = list[search];
            const path = search_book.fileCover;
            if (!!path) {
                fs.unlink(path, () => {
                    list.splice(search, 1);
                    res.redirect(`/books`);
                })

            }
            else {
                list.splice(search, 1);
                res.redirect(`/books`);
            }
        }
        else {
            res.status(404).redirect('/404');
        }

    })
    module.exports = router;