const Booking = require("../models/Booking");
const Flight = require("../models/Flight");
const mongoose = require("mongoose");

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

    let passengersE = [];
    let passengersB = [];

    passengers.forEach((item) => {
      if (item.classType === "Economy") passengersE.push(item);
      if (item.classType === "Business") passengersB.push(item);
    });

    const seatNumbersE = passengersE.map((p) => p.seatNumber);
    const seatNumbersB = passengersB.map((p) => p.seatNumber);

    const existingBookingsE = await Booking.find({
      flight,
      "passengers.seatNumber": { $in: seatNumbersE },
    });

    const existingBookingsB = await Booking.find({
      flight,
      "passengers.seatNumber": { $in: seatNumbersB },
    });

    if (existingBookingsE.length > 0 || existingBookingsB.length > 0) {
      return res.status(400).json({
        msg: `Seats already booked for this flight:`,
        existingBookingsE,
        existingBookingsB,
      });
    }

    const booking = await Booking.create(req.body);
    res.status(201).json({
      msg: "New booking successfully registered",
      booking,
    });

    const rowsE = [];
    const columnsE = [];
    seatNumbersE.forEach((item) => {
      const letter = item[0];
      const row = item[1];
      const letterValue = letter.charCodeAt(0) - 64;
      columnsE.push(letterValue);
      rowsE.push(parseInt(row, 10));
    });

    const rowsB = [];
    const columnsB = [];
    seatNumbersB.forEach((item) => {
      const letter = item[0];
      const row = item[1];
      const letterValue = letter.charCodeAt(0) - 64;
      columnsB.push(letterValue);
      rowsB.push(parseInt(row, 10));
    });

    const FLIGHT = await Flight.findOne({ _id: flight });

    for (let i = 0; i < seatNumbersE.length; i++) {
      FLIGHT.economySeats[rowsE[i] - 1][columnsE[i] - 1] = 1;
    }

    for (let i = 0; i < seatNumbersB.length; i++) {
      FLIGHT.businessSeats[rowsB[i] - 1][columnsB[i] - 1] = 1;
    }

    await FLIGHT.save();
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
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingID },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!booking) {
      res.status(404).json({ msg: `no booking with id: ${bookingID}` });
      return;
    }
    res
      .status(200)
      .json({ success: true, msg: "booking successfully updated" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id: bookingID } = req.params;
    const booking = await Booking.findOne({ _id: bookingID });
    if (!booking) {
      res.status(404).json({ msg: `no booking with id: ${bookingID}` });
      return;
    }
    const { flight, passengers } = booking;
    let passengersE = [];
    let passengersB = [];

    passengers.forEach((item) => {
      if (item.classType === "Economy") passengersE.push(item);
      if (item.classType === "Business") passengersB.push(item);
    });

    const seatNumbersE = passengersE.map((p) => p.seatNumber);
    const seatNumbersB = passengersB.map((p) => p.seatNumber);

    await Booking.findOneAndDelete({ _id: bookingID });

    const rowsE = [];
    const columnsE = [];
    seatNumbersE.forEach((item) => {
      const letter = item[0];
      const row = item[1];
      const letterValue = letter.charCodeAt(0) - 64;
      columnsE.push(letterValue);
      rowsE.push(parseInt(row, 10));
    });

    const rowsB = [];
    const columnsB = [];
    seatNumbersB.forEach((item) => {
      const letter = item[0];
      const row = item[1];
      const letterValue = letter.charCodeAt(0) - 64;
      columnsB.push(letterValue);
      rowsB.push(parseInt(row, 10));
    });

    const FLIGHT = await Flight.findOne({ _id: flight });

    for (let i = 0; i < seatNumbersE.length; i++) {
      FLIGHT.economySeats[rowsE[i] - 1][columnsE[i] - 1] = 0;
    }

    for (let i = 0; i < seatNumbersB.length; i++) {
      FLIGHT.businessSeats[rowsB[i] - 1][columnsB[i] - 1] = 0;
    }

    await FLIGHT.save();

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
