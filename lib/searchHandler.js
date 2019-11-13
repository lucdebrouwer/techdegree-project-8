const db = require("../db");
const { Book } = db.models;
module.exports = searchDatabase = async (req, res, next, query) => {
  const Op = db.Sequelize.Op;
  let options = {
    order: [["title", "asc"]],
    limit: 10,
    offset: 0,
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${query.toLowerCase()}%`
          }
        },
        {
          author: {
            [Op.like]: `%${query.toLowerCase()}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${query.toLowerCase()}%`
          }
        },
        {
          year: {
            [Op.like]: query
          }
        }
      ]
    }
  };
  if (req.query.page) {
    (options.limit = 10),
      (options.offset = (req.query.page - 1) * options.limit);
  }

  const books = await Book.findAndCountAll(options)
    .then(books => {
      let totalBooks = books.count; // store bookcount
      let perPage = 10;
      let pages = Math.ceil(totalBooks / perPage); // count pages
      let current = req.query.page ? req.query.page : 1; // Set current page, by default the page is 1

      res.render("index", {
        books: books.rows,
        totalBooks,
        perPage,
        pages,
        current,
        search: true
      });

      // Render our paginated book list
    })
    .catch(err => {
      next(err); // Pass any errors to our error middlware
    });
  return books;
};
