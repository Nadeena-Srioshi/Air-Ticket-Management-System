const Flight = require("../models/Flight");

const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find({});
    res.status(200).json({
      flights: flights,
      amount: flights.length,
      msg: "all flights fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const getFlightsByParams = async (req, res) => {
  try {
    const {
      departure: { departPort, departDate },
      arrival: { arrivePort },
    } = req.body;
    const departDateStr = new Date(departDate).toISOString().split("T")[0];
    const flights = await Flight.find({
      "departure.airport": departPort,
      "arrival.airport": arrivePort,
      "departure.dateTime": {
        $gte: new Date(departDateStr + "T00:00:00Z"),
        $lt: new Date(departDateStr + "T23:59:59Z"),
      },
    });
    res.json({ flights });
  } catch (error) {
    console.error("Error fetching flights:", error);
    res.status(500).json({msg: "Error fetching flights"});
  }
};

const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ msg: "new flight successfully registered" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
}; //just for postman, no graceful error handling

const getFlight = async (req, res) => {
  try {
    const { id: flightID } = req.params;
    const flight = await Flight.findOne({ _id: flightID });
    if (!flight) {
      res.status(404).json({ msg: `no flight with id: ${flightID}` });
      return;
    }
    res.status(200).json({ flight: flight });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const updateFlight = async (req, res) => {
  try {
    const { id: flightID } = req.params;
    const flight = await Flight.findOneAndUpdate({ _id: flightID }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flight) {
      res.status(404).json({ msg: `no flight with id: ${flightID}` });
      return;
    }
    req.session.flight = flight;
    res.status(200).json({ msg: "flight successfully updated" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
}; //for postman

const deleteFlight = async (req, res) => {
  try {
    const { id: flightID } = req.params;
    const flight = await Flight.findOneAndDelete({ _id: flightID });
    if (!flight) {
      res.status(404).json({ msg: `no flight with id: ${flightID}` });
      return;
    }
    res.status(200).json({ flight: null, status: "success" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
}; //for postman

module.exports = {
  getAllFlights,
  getFlightsByParams,
  createFlight,
  getFlight,
  updateFlight,
  deleteFlight,
};
