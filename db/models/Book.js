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
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      genre: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      }
    },
    { sequelize }
  );

  return Book;
};
