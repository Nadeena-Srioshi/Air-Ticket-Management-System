const express = require("express");
const router = express.Router();

const {
  getAllFlights,
  getFlightsByParams,
  createFlight,
  getFlight,
  updateFlight,
  deleteFlight,
} = require("../controllers/flights");

router.get("/", getAllFlights);

router.post("/params", getFlightsByParams);

router.post("/", createFlight);

router.get("/id/:id", getFlight);

router.patch("/:id", updateFlight);

router.delete("/:id", deleteFlight);

module.exports = router;
