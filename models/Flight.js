const mongoose = require("mongoose");
const sequence = require("mongoose-sequence")(mongoose);

const FlightSchema = new mongoose.Schema({
  flightId: {
    type: Number,
    unique: true,
  },
  departure: {
    airport: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
  },
  arrival: {
    airport: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
  },
  economyPrice: {
    type: Number,
    required: true,
  },
  businessPrice: {
    type: Number,
    required: true,
  },
  economySeats: [[Number]],
  businessSeats: [[Number]],
  isEconomyFull: {
    type: Boolean,
    default: false,
  },
  isBusinessFull: {
    type: Boolean,
    default: false,
  },
});

FlightSchema.plugin(sequence, {
  inc_field: "flightId",
  start_seq: 4000,
});

module.exports = mongoose.model("Flight", FlightSchema);
