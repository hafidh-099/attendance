require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/database");
const userRoutes = require("./routes/login.route");
const bodyParser = require("body-parser");
const attendanceRoutes = require("./routes/attendance.route");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", userRoutes);
app.use("/api/attendance", attendanceRoutes);

db.sync({ alter: true }).then(() => {
  console.log("database synced");
});

app.listen(4000, () => {
  console.log("server is running on http://localhost:4000");
});
