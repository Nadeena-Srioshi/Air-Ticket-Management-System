const mongoose = require("mongoose");

const validatePassengers = async function (next) {
  try {
    const seatNumbers = this.passengers.map((p) => p.seatNumber);
    const passportNumbers = this.passengers.map((p) => p.passportNumber);

    if (passportNumbers.length !== new Set(passportNumbers).size) {
      return next(
        new Error(
          "Duplicate passport numbers are not allowed in the same booking."
        )
      );
    }

    const existingBookings = await mongoose.model("Booking").find({
      flight: this.flight,
      "passengers.seatNumber": { $in: seatNumbers },
    });

    if (existingBookings.length > 0) {
      const conflictingSeats = existingBookings
        .flatMap((b) => b.passengers)
        .filter((p) => seatNumbers.includes(p.seatNumber))
        .map((p) => p.seatNumber);

      return next(
        new Error(
          `Seats already booked for this flight: ${conflictingSeats.join(", ")}`
        )
      );
    }

    next();
  } catch (err) {
    next(err);
  }
}; //copied function

module.exports = validatePassengers;
