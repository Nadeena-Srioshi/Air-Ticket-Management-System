const fs = require("fs");

// Helper function to get a random integer between min and max (inclusive)
const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate a random date-time between a range
const getRandomDateTime = (start, end) => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString();
};

// Generate a matrix filled with all 0s of the given dimensions
const generateMatrix = (rows, cols) =>
  Array.from({ length: rows }, () => Array(cols).fill(0));

// Estimated flight durations (in hours)
const flightDurations = {
  JFK: { SVO: 9, LHR: 7, DEL: 15 },
  SVO: { JFK: 9, LHR: 5, DEL: 6 },
  LHR: { JFK: 7, SVO: 5, DEL: 8 },
  DEL: { JFK: 15, SVO: 6, LHR: 8 },
};

// Calculate realistic arrival date-time based on flight duration
const calculateArrivalDateTime = (departureDateTime, departure, arrival) => {
  const duration = flightDurations[departure][arrival] || 6; // Default to 6 hours if no match
  const arrivalDate = new Date(departureDateTime);
  arrivalDate.setHours(arrivalDate.getHours() + duration);
  return arrivalDate.toISOString();
};

// Main function to generate flight records
const generateFlightData = (numRecords, startId) => {
  const airports = ["JFK", "SVO", "LHR", "DEL"];
  const startDate = new Date("2025-01-25T00:00:00Z");
  const endDate = new Date("2025-03-31T23:59:59Z");

  const records = Array.from({ length: numRecords }, (_, index) => {
    const departureAirport = airports[getRandomInt(0, airports.length - 1)];
    let arrivalAirport;
    do {
      arrivalAirport = airports[getRandomInt(0, airports.length - 1)];
    } while (arrivalAirport === departureAirport);

    const departureDateTime = getRandomDateTime(startDate, endDate);
    const arrivalDateTime = calculateArrivalDateTime(
      departureDateTime,
      departureAirport,
      arrivalAirport
    );

    return {
      flightId: startId + index, // Generate sequential flight IDs
      departure: {
        airport: departureAirport,
        dateTime: departureDateTime,
      },
      arrival: {
        airport: arrivalAirport,
        dateTime: arrivalDateTime,
      },
      economyPrice: getRandomInt(50, 100) * 10,
      businessPrice: getRandomInt(200, 300) * 10,
      economySeats: generateMatrix(8, 6),
      businessSeats: generateMatrix(3, 4),
      isEconomyFull: false,
      isBusinessFull: false,
    };
  });

  return records;
};

// Save records to a JSON file
const saveToFile = (data, filename) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`${data.length} records saved to ${filename}`);
};

// Generate and save the data
const numRecords = 4096; // Adjust the number of records as needed
const startId = 4000; // Starting flight ID
const filename = "flight_data.json";
const flightData = generateFlightData(numRecords, startId);
saveToFile(flightData, filename);
