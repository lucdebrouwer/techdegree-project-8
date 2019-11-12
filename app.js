/* General Setup */
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const path = require("path");
const db = require("./db");
const sequelize = db.sequelize;
/* Importing Routes */
const bookRoutes = require("./routes/book");

/* Use an async handler middleware function to handle our async functions*/
const asyncHandler = require("./asyncHandler");
/* Middleware setup */
app.use("/static", express.static(path.join(__dirname, "public")));
app.set("view engine", "pug");
app.use(bookRoutes);

/* Render an Error page if an error occurs on the route */

app.use((error, req, res, next) => {
  const customError = new Error();
  customError.message = error.message;
  customError.status = error.status;
  customError.description = error.description;
  res.status(500).render("error", { error: customError });
});

// Render our home page to the user
app.get(
  "/",
  asyncHandler(async (req, res, next) => {
    res.redirect("/books");
  })
);

// Listen for all routes
// Display a custom 404 page if an user is trying to access a page that doesn't exist.
app.get("*", (req, res, next) => {
  const error = new Error("Page Not Found!");
  error.status = 404;
  error.description =
    "The fenominal book page you were trying to reach was not found in our library, please try another one";
  res.status(404).render("page-not-found", { error });
});
// Before we launch our application we want to sync our models with the database
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`The app is listening on port: ${port}`);
  });
});
