require("dotenv").config();
const mongoose = require("mongoose");

const connectionString = process.env.MONGO_URI;

mongoose
  .connect(connectionString)
  .then(() => console.log("CONNECTED TO DB"))
  .catch((err) => console.log(err));
