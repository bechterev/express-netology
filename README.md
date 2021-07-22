# express-netology

https://express-netology.herokuapp.com/

//request for database
//create books

    db.books.insertMany(books.map(el=>{return {title:el.title, description: el.description, authors: el.authors}}));

//search book

    let searchTitle = req.body.title;
        db.books.find({
            title: searchTitle})

//update filds book

    const { id } = req.params;
    const bookParam = req.body;
    db.books.updateOne({id: id},
        {$set:{description: bookParam.description,
        authors:bookParam.authors}}
    )