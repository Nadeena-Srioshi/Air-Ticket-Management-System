const Booking = require("../models/Booking");

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json({
      bookings: bookings,
      amount: bookings.length,
      msg: "all bookings fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const createBooking = async (req, res) => {
  try {
    const { flight, passengers } = req.body;

    const seatNumbers = passengers.map((p) => p.seatNumber);

    const existingBookings = await Booking.find({
      flight,
      "passengers.seatNumber": { $in: seatNumbers },
    });

    if (existingBookings.length > 0) {
      const conflictingSeats = existingBookings
        .flatMap((b) => b.passengers)
        .filter((p) => seatNumbers.includes(p.seatNumber))
        .map((p) => p.seatNumber);

      return res.status(400).json({
        msg: `Seats already booked for this flight: ${conflictingSeats.join(
          ", "
        )}`,
      });
    }

    const booking = await Booking.create(req.body);
    res.status(201).json({
      msg: "New booking successfully registered",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const getBooking = async (req, res) => {
  try {
    const { id: bookingID } = req.params;
    const booking = await Booking.findOne({ _id: bookingID });
    if (!booking) {
      res.status(404).json({ msg: `no booking with id: ${bookingID}` });
      return;
    }
    res.status(200).json({ booking: booking });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id: bookingID } = req.params;
    const { flight, passengers } = req.body;

    const seatNumbers = passengers.map((p) => p.seatNumber);

    const existingBookings = await Booking.find({
      _id: { $ne: bookingID },
      flight,
      "passengers.seatNumber": { $in: seatNumbers },
    });

    if (existingBookings.length > 0) {
      const conflictingSeats = existingBookings
        .flatMap((b) => b.passengers)
        .filter((p) => seatNumbers.includes(p.seatNumber))
        .map((p) => p.seatNumber);

      return res.status(400).json({
        msg: `Seats already booked for this flight: ${conflictingSeats.join(
          ", "
        )}`,
      });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingID },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!booking) {
      return res.status(404).json({ msg: `No booking with id: ${bookingID}` });
    }

    res.status(200).json({
      msg: "Booking successfully updated",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id: bookingID } = req.params;
    const booking = await Booking.findOneAndDelete({ _id: bookingID });
    if (!booking) {
      res.status(404).json({ msg: `no booking with id: ${bookingID}` });
      return;
    }
    res.status(200).json({ booking: null, status: "success" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

module.exports = {
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
};
