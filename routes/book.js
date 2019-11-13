/* General Setup */
const express = require("express");
const router = express.Router();

/* Middleware Setup */
// Import the async handler middleware function to handle our async functions
const asyncHandler = require("../asyncHandler");
const searchHandler = require("../lib/searchHandler");
const bodyParser = require("body-parser");

// support json encoded bodies
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

/* Sequelize */
const db = require("../db");
const { Book } = db.models;

// const paginate = (page, pageSize) => {
//   const offset = page * pageSize;
//   const limit = offset + pageSize;
// }

// const paginateHandler = (req, res, next) => {
//   paginate(req.params.page, 10)
// }
/* For each route that handles database interactions, I've wrapped them in an asyncHandler
By doing so, we seperate our logic and it keeps the code organized and easier to maintain */

router.get(
  "/books",
  asyncHandler(async (req, res, next) => {
    // Future TODO:
    // Refactor the code below into a seperate pagination handler
    // I already tried refactoring this the first time, but it went entirely wrong with the variables
    // Specify our options, by default we only want to display 10 rows and use no offset.
    let options = {
      order: [["title", "asc"]],
      limit: 10,
      offset: 0
    };

    // This piece of code will look up whether the user clicked on the pagination link
    // If the user clicked on the pagination link, calculate the offset.
    if (req.query.page) {
      (options.limit = 10),
        (options.offset = (req.query.page - 1) * options.limit);
    }
    // We want to find all books and count them so we can create our pages to paginate
    await Book.findAndCountAll(options)
      .then(books => {
        let totalBooks = books.count; // store bookcount
        let perPage = 10;
        let pages = Math.ceil(totalBooks / perPage); // count pages
        let current = req.query.page ? req.query.page : 1; // Set current page, by default the page is 1

        // Render our paginated book list
        res.render("index", {
          books: books.rows,
          totalBooks,
          perPage,
          pages,
          current
        });
      })
      .catch(err => {
        next(err); // Pass any errors to our error middlware
      });
  })
);

router.get(
  "/books/search/:query",
  asyncHandler(async (req, res, next) => {
    const query = req.params.query;
    try {
      await searchHandler(req, res, next, query); // pass middleware options to handler to access params and to pass errors to next();
    } catch (error) {
      next(error);
    }
  })
);
router.post(
  "/books/search",
  asyncHandler(async (req, res, next) => {
    const query = req.body;
    console.log(query);
    try {
      const books = await searchHandler(req, res, next, query.search); // pass middleware options to handler to access params and to pass errors to next();
      if (books > 0) {
        res.render("index", { books, search: true });
      }
    } catch (error) {
      next(error);
    }
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
