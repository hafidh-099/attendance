const { DataTypes } = require("sequelize");
const db = require("../config/database");
const User = require("./user.model");

// Attendance model
const Attendance = db.define("Attendance", {
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: true, // null until checkout
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
  longitude: {
    type: DataTypes.DECIMAL(10, 7),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("Present", "Absent", "Late"),
    defaultValue: "Present",
    allowNull: false,
  },
});

// Associations
Attendance.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Attendance, { foreignKey: "userId" });

module.exports = Attendance;
