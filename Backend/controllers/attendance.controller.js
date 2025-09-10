const attendance = require("../model/attendance.model");
const { validationResult } = require("express-validator");
const { getDistanceFromLatLonInMeters } = require("../utils/location");
const { Op } = require("sequelize");

//location setting
const ORG_LAT = parseFloat(process.env.ORG_LATITUDE);
const ORG_LON = parseFloat(process.env.ORG_LONGITUDE);
const ORG_RADIUS = parseFloat(process.env.ORG_RADIUS_METERS);

exports.checkIn = async (req, res) => {
  const userId = req.user.id; //from jwt middleware
  const { latitude, longitude } = req.body;
  if (!latitude || !longitude) {
    return res.status(400).json({ message: "GPS coordinates required" });
  }
  const distance = getDistanceFromLatLonInMeters(
    latitude,
    longitude,
    ORG_LAT,
    ORG_LON
  );
  if (distance > ORG_RADIUS) {
    return res.status(403).json({ message: "Not within organization area" });
  }
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingToday = await attendance.findOne({
      where: { userId, checkIn: { [Op.gte]: startOfDay, [Op.lte]: endOfDay } },
    });
    if (existingToday) {
      return res.status(400).json({ message: "user existing today" });
    }
    const Attendance = await attendance.create({
      userId,
      checkIn: new Date(),
      latitude,
      longitude,
    });
    res.json({ message: "check in successfully", Attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

exports.checkOut = async (req, res) => {
  const userId = req.user.id;
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: "GPS coordinates required" });
  }

  const distance = getDistanceFromLatLonInMeters(
    latitude,
    longitude,
    ORG_LAT,
    ORG_LON
  );
  if (distance > ORG_RADIUS) {
    return res.status(403).json({ message: "Not within organization area" });
  }

  try {
    const Attendance = await attendance.findOne({
      where: {
        userId,
        checkOut: null,
      },
      order: [["checkIn", "DESC"]],
    });
    if (!Attendance) {
      return res.status(400).json({ message: "No check in recorderd" });
    }
    Attendance.checkOut = new Date();
    Attendance.latitude = latitude;
    Attendance.longitude = longitude;
    await Attendance.save();
    res
      .status(201)
      .json({ message: "Thank for your responsiblity", Attendance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};

//employee view only attendance
exports.myAttendance = async (req, res) => {
  const userId = req.user.id;
  try {
    const record = await attendance.findAll({
      where: { userId },
      order: [["checkIn", "DESC"]],
    });
    res.json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
};
