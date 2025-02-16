const express = require("express");
const router = express.Router();

const {
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

router.get("/", getAllBookings);

router.post("/", createBooking);

router.get("/id/:id", getBooking);

router.patch("/:id", updateBooking);

router.delete("/:id", deleteBooking);

module.exports = router;
