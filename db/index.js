/* Initial Setup */
const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "library.db",
  logging: true
});

/* Database Instance Section */
const db = {
  sequelize,
  Sequelize,
  models: {}
};

/* Setting the Models Section */
db.models.Book = require("./models/Book")(sequelize);

/* Export the database instance */
module.exports = db;
