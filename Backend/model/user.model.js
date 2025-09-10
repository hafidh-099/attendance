const { DataTypes } = require("sequelize");
const databaseConfig = require("../config/database");

const User = databaseConfig.define("Users", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("employee", "admin"), DefaultValue: "employee" },
  department: { type: DataTypes.STRING },
});
module.exports = User;
