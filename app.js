const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const bookRoutes = require("./routes/book");

app.use(bookRoutes);
app.use("/static", express.static("public"));
app.set("view engine", "pug");

// Render our home page to the user
app.get("/", (req, res, next) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`The app is listening on port: ${port}`);
});
