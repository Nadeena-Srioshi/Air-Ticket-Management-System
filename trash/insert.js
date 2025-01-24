require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Flight = require("../models/Flight"); // Adjust the path to your Flight model

const what = "";
// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(what, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

// Function to read JSON file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
};

// Function to insert data into the database
const insertFlightData = async (filePath) => {
  const flightData = readJsonFile(filePath);
  if (!flightData) {
    console.error("No data to insert");
    return;
  }

  try {
    await Flight.insertMany(flightData);
    console.log(`${flightData.length} flight records inserted successfully`);
  } catch (error) {
    console.error("Error inserting flight records:", error);
  }
};

// Main execution function
const main = async () => {
  await connectDB();
  const filePath = "./flight_data.json"; // Adjust to the path of your JSON file
  await insertFlightData(filePath);
  mongoose.disconnect();
  console.log("Database connection closed");
};

main();
