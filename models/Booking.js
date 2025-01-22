const mongoose = require("mongoose");
const sequence = require("mongoose-sequence")(mongoose);
const validatePassengers = require("../middleware/validate-passengers");

const validateEmail = function (email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const BookingSchema = new mongoose.Schema({
  bookingId: {
    type: Number,
    unique: true,
  },
  flight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Flight",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  passengers: [
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 128,
      },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate: validateEmail,
      },
      passportNumber: {
        type: String,
        required: true,
        trim: true,
      },
      classType: {
        type: String,
        enum: ["Economy", "Business"],
        required: true,
      },
      seatNumber: {
        type: String,
        required: true,
      },
    },
  ],
  bookingDate: {
    type: Date,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed"],
    default: "Pending",
  },
});

BookingSchema.plugin(sequence, {
  inc_field: "bookingId",
  start_seq: 2000,
});

BookingSchema.pre("save", validatePassengers);

module.exports = mongoose.model("Booking", BookingSchema);
