const printAll = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/users");
    const data = response.data;
    res.render("printall", { users: data.users, userCount: data.users.length });
  } catch (error) {
    res.render("printall", { users: [], error: "unable to fetch users" });
    console.log(error);
  }
}; //just for testing, require axios

const remove = async (req, res) => {
  try {
    await axios.delete(
      `http://localhost:3000/api/v1/users/${req.session.user._id}`
    );
    req.session.destroy();
    res.redirect(302, "/index");
  } catch (error) {
    res.status(500).json({ msg: "failed to delete" });
    console.log(error);
  }
}; //unused function, making the api call directly from frontend

const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  departure: {
    airport: { type: String, required: true },
    dateTime: { type: Date, required: true },
  },
  arrival: {
    airport: { type: String, required: true },
    dateTime: { type: Date, required: true },
  },
  economyPrice: { type: Number, required: true },
  businessPrice: { type: Number, required: true },
  economySeats: [[Number]],
  businessSeats: [[Number]],
  isEconomyFull: { type: Boolean, default: false },
  isBusinessFull: { type: Boolean, default: false },
});

const Flight = mongoose.model("Flight", flightSchema);
module.exports = Flight;

const isMatrixFull = (matrix) => {
  return matrix.every((row) => row.every((seat) => seat === 1));
};

router.post("/book", async (req, res) => {
  const { flightId, seat, classType } = req.body;

  try {
    const rowId = seat.match(/[A-Z]+/g)[0];
    const colId = parseInt(seat.match(/\d+/g)[0]) - 1;

    const rowIndex = getRowIndex(rowId);

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ error: "Flight not found" });
    }

    const seatMatrix =
      classType === "economy" ? flight.economySeats : flight.businessSeats;

    if (seatMatrix[rowIndex][colId] === 1) {
      return res.status(400).json({ error: "Seat is already booked" });
    }

    seatMatrix[rowIndex][colId] = 1;

    if (classType === "economy") {
      flight.isEconomyFull = isMatrixFull(flight.economySeats);
    } else {
      flight.isBusinessFull = isMatrixFull(flight.businessSeats);
    }

    await flight.save();

    res
      .status(200)
      .json({ message: `${classType} seat ${seat} booked successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

await Flight.save();