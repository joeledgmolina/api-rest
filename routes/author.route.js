/**Definimos una ruta */
const { Router } = require("express");
const router = Router();

/**Importamos lodash
 * Esta libreria sirve para manipular arrays
 */
const _ = require("lodash");

/**Importamos los authors desde el json */
const authors = require("../sample-author.json");

/**Importamos los books desde el json */
const books = require("../sample-book.json");

/**Definimos una ruta para recibir informacion
 * Con req obtenemos los datos que envia el usuario
 * Con res seteamos los que vamos a devolver
 */

router.get("/authors", (req, res) => {
  res.json(authors);
});

router.post("/authors", (req, res) => {
  const { name, lastname } = req.body;
  if (name && lastname) {
    const newAuthor = { ...req.body };
    authors.push(newAuthor);
    res.json({ added: "ok" });
  } else {
    res.status(400).json({ statusCode: "Bad request" });
  }
});

router.put("/authors/:id", (req, res) => {
  const id = req.params.id;
  const { name, lastname } = req.body;
  /**Chequeo si el autor que quiero modificar esta agregado */
  var existAuthor = _.find(authors, function (o) {
    return o.id == id;
  });
  if (existAuthor) {
    if (name && lastname) {
      _.each(authors, (a) => {
        if (a.id == id) {
          a.name = name;
          a.lastname = lastname;
        }
      });
      res.json({ modified: "ok" });
    } else {
      res.status(400).json({ statusCode: "Bad request" });
    }
  } else {
    /**Devuelvo un 404 porque el autor que quiero modificar no existe */
    res.status(404).json({
      statusCode: "No hay un autor registrado que se corresponda con esa id",
    });
  }
});

router.delete("/authors/:id", (req, res) => {
  const id = req.params.id;
  /**Chequea si el autor que quiero borrar esta agregado */
  var existAuthor = _.find(authors, function (o) {
    return o.id === id;
  });
  if (existAuthor) {
    var haveBook = books.find((book) => book.authorId === id);
    /**Si el autor que quiero borrar tiene un libro entonces no lo puedo borrar */
    if (haveBook) {
      res.status(400).json({
        statusCode:
          "No se puede borrar porque este autor tiene libros asociados",
      });
    } else {
      _.remove(authors, (author) => {
        return author.id == id;
      });
      res.json(authors);
    }
  } else {
    /**Devuelvo un 404 si el autor que quiero borrar no existe */
    res.status(404).json({
      statusCode: "No hay un autor registrado que se corresponda con esa id",
    });
  }
});

module.exports = router;
