const express = require("express");
const router = express.Router();

const {
  getAllFlights,
  createFlight,
  getFlight,
  updateFlight,
  deleteFlight,
} = require("../controllers/flights");

router.get("/", getAllFlights);

router.post("/", createFlight);

router.get("/id/:id", getFlight);

router.patch("/:id", updateFlight);

router.delete("/:id", deleteFlight);

module.exports = router;
