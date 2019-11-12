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
    res.render("new-book");
  })
);

router.post(
  "/books/new",
  asyncHandler(async (req, res, next) => {
    res.send(req.body);
    console.log(req.body);
    // Create a new book for our library database
    // Redirect the user back to the newly created book
  })
);

router.get(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    // Retrieve the book details of the book that needs to be updated
    // Render the update-book view
    const book = await Book.findByPk(req.params.id);
    res.render("update-book", { book });
  })
);

router.post(
  "/books/:id",
  asyncHandler(async (req, res, next) => {
    // Update the book details from the requested book
    // Redirect the user back to the books
  })
);

router.post(
  "/books/:id/delete",
  asyncHandler(async (req, res, next) => {
    // Delete the requested book
  })
);

module.exports = router;
