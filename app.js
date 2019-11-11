/* General Setup */
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const db = require("./db");

const sequelize = db.sequelize;
/* Importing Routes */
const bookRoutes = require("./routes/book");

/* Use an async handler middleware function to handle our async functions*/
const asyncHandler = require("./asyncHandler");

/* Middleware setup */
app.use(bookRoutes);
app.use("/static", express.static("public"));
app.set("view engine", "pug");

// Render our home page to the user
app.get(
  "/",
  asyncHandler(async (req, res, next) => {
    res.redirect("/books");
  })
);

// Before we launch our application we want to sync our models with the database
sequelize.sync({ force: false }).then(() => {
  app.listen(port, () => {
    console.log(`The app is listening on port: ${port}`);
  });
});
