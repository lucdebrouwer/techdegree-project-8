const Sequelize = require("sequelize");
module.exports = sequelize => {
  class Book extends Sequelize.Model {}
  /* Initialize the Book model, so it can be synced with the database */
  // TODO: Adding validation to check for types
  Book.init(
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "Title field can not be empty"
          }
        }
      },
      author: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: {
            msg: "Author field can not be empty"
          }
        }
      },
      genre: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER,
        validate: {
          isNumeric: {
            msg: "Year field only accepts numbers, not strings"
          }
        }
      }
    },
    { sequelize }
  );

  return Book;
};
