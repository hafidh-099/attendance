const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/auth.middleware");
const attendanceController  = require("../controllers/attendance.controller");

// Employee check-in
router.post("/checkin", authenticateJWT, attendanceController.checkIn);

// Employee check-out
router.post("/checkout", authenticateJWT, attendanceController.checkOut);

// Employee view own attendance
router.get("/mine", authenticateJWT, attendanceController.myAttendance);

module.exports = router;