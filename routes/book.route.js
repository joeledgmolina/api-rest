/**Definimos una ruta */
const {Router} = require('express');
const router = Router();

/**Importamos lodash. Esta libreria sirve para manipular arrays */
const _ = require('lodash');

/**Importamos los books desde el json */
const books = require('../sample-book.json');

/**Importamos los authors desde el json */
const authors = require('../sample-author.json');

router.get('/books',(req,res) =>{
    var array = new Array ();
    for(var i = 0 ; i < books.length ; i++){
        for (var j = 0 ; j < authors.length ; j++){
            if (books[i].authorId == authors[j].id){
                array[i] = {
                    "id": books[i].id,
                    "name": books[i].name,
                    "authorId": books[i].authorId,
                    "authorName" : authors[j].name,
                    "authorLastname": authors[j].lastname
                }
            }
        }
    }
    res.json(array);
});

router.post('/books',(req,res) =>{
    const{name,authorId} = req.body;
    for (var i = 0 ; i < authors.length ; i++){
        /**Chequeo si hay un autor ingresado que tenga id igual a authorId */
        if (authors[i].id == authorId){
            if (name && authorId){
                const newBook = {...req.body};
                books.push(newBook);
                res.json({"added":"ok"});
            }
            else{
                res.status(400).json({"statusCode":"Bad request"});
            }
        }
    }
    res.status(404).json({"statusCode":"No hay un autor ingresado que se corresponda con authorId"});
    
});

router.put('/books/:id',(req, res) =>{
    const id = req.params.id;
    const {name, authorId} = req.body;
    if ( _.find(books, function(o) { return o.id == id; })){
        if (name && authorId){
            _.each(books,(book) =>{
                if (book.id == id){
                    book.name = name;
                    book.authorId = authorId;
                }
            });
            res.json({"modified":"ok"});
        }
        else{
            res.status(400).json({"statusCode":"Bad request"});
        }
    }
    else {
        res.status(404).json({"statusCode":"No hay un libro registrado que se corresponda con ese id"}); 
    }
    
});

router.delete('/books/:id',(req, res)=>{
    const id = req.params.id;
    /**Chequea si el id del libro que quiero borrar existe */
    if ( _.find(books, function(o) { return o.id == id; })){
        _.remove(books,(book)=>{
            return book.id == id
        })
        res.json(books);
    }
    res.status(404).json({"statusCode":"No hay un libro registrado que se corresponda con ese id"}); 
});

module.exports = router;