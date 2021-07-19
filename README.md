# express-netology

https://express-netology.herokuapp.com/

//request for database
//create books
router.post('/create',  (req, res) => {
let arrayBooks = req.body.books;
try{
    db.books.insertMany(books.foreach(el=>{title:el.title, description: el.description, authors: el.authors})).
    then(res.status(201).json({success:`adding data seccess`});
    
}
catch(err){
   
    res.status(404).json({err:adding books failed with an error: ${err}});
}
});
//search book
router.post('/search',(req,res) =>{
    let searchTitle = req.body.title;
    try{
        db.books.find({
            title: searchTitle
        }).then((data)=>{
            res.status(200).json(data);
        })
    }
    catch(err){
        res.status(404).json({err:`book with title ${searchTitle} not found`});
    }
})
//update filds book
router.post('/update/:id', (req, res) => {
    const { id } = req.params;
    const bookParam = req.body;
    try{
    db.books.updateOne({
        id: id
    },[
        {$set:{description: bookParam.description,
        authors=bookParam.authors}}
    ]).then(res.status(201).json(`book updated`))
    }
    catch(err){
        res.status(404).json(`update book failed because: ${err}`)
    }
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