const express = require("express");
const { connectToDB, getDB } = require("./db");
const { ObjectId } = require("mongodb");

//Initializing & Middleware

const app = express();
app.use(express.json());

let db;

connectToDB((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("App started listening to port 3000");
    });
    db = getDB();
  }
});

//routes
app.get("/books", (req, res) => {

    const pages = req.query.p || 0
    const booksPerPage = 2

  let books = [];

  db.collection("books")
    .find()
    .skip(pages * booksPerPage)
    .limit(booksPerPage)
    .forEach((book) => books.push(book))
    .then(() => {
      res.status(200).json(books);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch documents" });
    });
});

app.get("/books/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("books")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: "Could not find the document" });
      });
  } else {
    res.status(500).json({ error: "Not a valid ObjectId" });
  }
});

app.post("/books", (req, res) => {
  const book = req.body;

  db.collection("books")
    .insertOne(book)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ Error: "Could not create a new Document" });
    });
});


app.delete("/books/:id", (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection("books")
          .deleteOne({ _id: new ObjectId(req.params.id) })
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            res.status(500).json({ err: "Could not delete the document" });
          });
      } else {
        res.status(500).json({ error: "Not a valid ObjectId" });
      }
})


app.patch("/books/:id", (req, res) => {
    let updates = req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection("books")
          .updateOne({ _id: new ObjectId(req.params.id) }, {$set: updates})
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((err) => {
            res.status(500).json({ err: "Could not update document" });
          });
      } else {
        res.status(500).json({ error: "Not a valid ObjectId" });
      }

})