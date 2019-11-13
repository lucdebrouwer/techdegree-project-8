const db = require("../db");
const { Book } = db.models;
module.exports = searchDatabase = async query => {
  const Op = db.Sequelize.Op;
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${query.search.toLowerCase()}%`
          }
        },
        {
          author: {
            [Op.like]: `%${query.search.toLowerCase()}%`
          }
        },
        {
          genre: {
            [Op.like]: `%${query.search.toLowerCase()}%`
          }
        },
        {
          year: {
            [Op.like]: query.search
          }
        }
      ]
    }
  });
  return books;
};
