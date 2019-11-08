const express = require("express");
const router = express.router();

/* For each route that handles database interactions I am writing asynchronous functions with async/await,
that serve as callback whenever an user interacts with the application, so we keep our code organized and logic seperated */

// Retrieve all books from our library database
// Retrieve a new book
// Create a new book for our library database
// Get one specific book from our library database
// Update a specific book from our library database
// Remove a specific book from our library database

router.get("/books", () => {});

router.get("/books/new", () => {});

router.post("/books/new", () => {});

router.get("/books/:id", () => {});

router.post("/books/:id", () => {});

router.post("/books/:id/delete");

module.exports = router;
