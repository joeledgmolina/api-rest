/**Definimos una ruta */
const { Router } = require("express");
const router = Router();

/**Importamos lodash. Esta libreria sirve para manipular arrays */
const _ = require("lodash");

/**Importamos los books desde el json */
const books = require("../sample-book.json");

/**Importamos los authors desde el json */
const authors = require("../sample-author.json");

router.get("/books", (req, res) => {
  /**Creo un array para almacenar los datos del libro y de su respectivo autor */
  var array = new Array();
  for (var i = 0; i < books.length; i++) {
    for (var j = 0; j < authors.length; j++) {
      if (books[i].authorId == authors[j].id) {
        array[i] = {
          id: books[i].id,
          name: books[i].name,
          authorId: books[i].authorId,
          authorName: authors[j].name,
          authorLastname: authors[j].lastname,
        };
      }
    }
  }
  res.json(array);
});

router.post("/books", (req, res) => {
  const { name, authorId } = req.body;
  var existAuthor = authors.find((author) => author.id === authorId);
  /**Chequea si hay un autor ingresado que tenga id igual a authorId */
  if (existAuthor) {
    if (name && authorId) {
      const newBook = { ...req.body };
      books.push(newBook);
      res.json({ added: "ok" });
    } else {
      /**Si faltan datos entonces tiro un 400 */
      res.status(400).json({ statusCode: "Bad request" });
    }
  }
  /**Tiro un 404 porque quiero agregar un libro de un autor que no tengo agregado */
  res.status(404).json({
    statusCode: "No hay un autor ingresado que se corresponda con authorId",
  });
});

router.put("/books/:id", (req, res) => {
  const id = req.params.id;
  const { name, authorId } = req.body;
  /**Chequea si el libro que quiero modificar esta agregado */
  var existBook = _.find(books, function (o) {
    return o.id === id;
  });
  if (existBook) {
    if (name && authorId) {
      _.each(books, (book) => {
        if (book.id == id) {
          book.name = name;
          book.authorId = authorId;
        }
      });
      res.json({ modified: "ok" });
    } else {
      res.status(400).json({ statusCode: "Bad request" });
    }
  } else {
    /**Tiro un 404 si intento modificar un libro que no tengo */
    res.status(404).json({
      statusCode: "No hay un libro registrado que se corresponda con ese id",
    });
  }
});

router.delete("/books/:id", (req, res) => {
  const id = req.params.id;
  /**Chequea si el id del libro que quiero borrar existe */
  var existBook = _.find(books, function (o) {
    return o.id == id;
  });
  if (existBook) {
    _.remove(books, (book) => {
      return book.id == id;
    });
    res.json(books);
  } else {
    res.status(404).json({
      statusCode: "No hay un libro registrado que se corresponda con ese id",
    });
  }
});

module.exports = router;
