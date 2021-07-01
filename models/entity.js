const uidGenerator = require('node-unique-id-generator');
class Book {
    constructor(book){
        this.title = book.title?book.title:'';
        this.description = book.description!==undefined?book.description:'';
        this.authors = book.authors!==undefined?book.authors:'';
        this.favorite = book.favorite!==undefined?book.favorite:'';
        this.fileCover = book.fileCover!==undefined?book.fileCover:'';
        this.fileName = book.fileName!==undefined?book.fileName:'';
        this.id = uidGenerator.generateUniqueId();
    }
    update(book){
        this.title = book.title?book.title:'';
        this.description = book.description!==undefined?book.description:'';
        this.authors = book.authors!==undefined?book.authors:'';
        this.favorite = book.favorite!==undefined?book.favorite:'';
        this.fileCover = book.fileCover!==undefined?book.fileCover:'';
        this.fileName = book.fileName!==undefined?book.fileName:'';
    }
    search_id(id){
        console.log(id)
        if(id===this.id) return true;
        else return false;
    }
}
module.exports = Book;