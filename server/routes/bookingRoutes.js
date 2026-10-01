const express = require("express");

const {
  getBookings,
  getBookingById,
} = require("../controllers/bookingController");

const router = express.Router();

router.get("/", getBookings);

router.get("/:id", getBookingById);

module.exports = router;