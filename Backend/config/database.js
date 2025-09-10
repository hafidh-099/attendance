require("dotenv").config();
const { Sequelize } = require("sequelize");

const databaseConfig = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);
// Optional: test connection
databaseConfig.authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.error("❌ Unable to connect:", err));
module.exports = databaseConfig;
