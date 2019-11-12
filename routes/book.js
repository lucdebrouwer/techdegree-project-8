/* General Setup */
const express = require("express");
const router = express.Router();

/* Middleware Setup */
// Import the async handler middleware function to handle our async functions
const asyncHandler = require("../asyncHandler");
const bodyParser = require("body-parser");

// support json encoded bodies
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/* Sequelize */
const db = require("../db");
const { Book } = db.models;

/* For each route that handles database interactions, I've wrapped them in an asyncHandler
By doing so, we seperate our logic and it keeps the code organized and easier to maintain */

router.get(
  "/books",
  asyncHandler(async (req, res, next) => {
    // Retrieve all books from our library database
    const books = await Book.findAll();
    res.render("index", { books });
  })
);

router.get(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    // Render the new book form view
    const errors = {};
    res.render("new-book", { errors });
  })
);

router.post(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      // Create a new book for our library database
      book = await Book.create(req.body);
      // Redirect the user back to the newly created book
      res.redirect("/books");
    } catch (error) {
      book = await Book.build(req.body);
      // Re-render the page
      // Pass along any errors if found
      res.render("new-book", { book, error: error.errors });
    }
  })
);

router.get(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    // Retrieve the book details of the book that needs to be updated
    // Render the update-book view
    const errors = {};
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      const err = new Error("Book Not Found!");
      err.description =
        "The book you were trying to access, was not found. Please try another book";
      err.status = 404;
      next(err);
    } else {
      res.render("update-book", {
        book,
        errors
      });
    }
  })
);

router.post(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    let book;
    try {
      // Find the requested book
      book = await Book.findByPk(req.params.id);
      // If book exists, update the record
      if (book) {
        await book.update(req.body);
        // Redirect the user back to the books
        res.redirect("/books");
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", { book, error: error.errors });
    }
  })
);

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res, next) => {
    // Retrieve requested book
    const book = await Book.findByPk(req.params.id);
    if (book) {
      // Delete the requested book
      await book.destroy();
      res.redirect("/books");
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
