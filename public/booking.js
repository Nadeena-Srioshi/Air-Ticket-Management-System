document.getElementById("search-btn").addEventListener("click", async () => {
  const tripType = document.querySelector(
    'input[name="tripType"]:checked'
  ).value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const departureDate = document.getElementById("departure-date").value;
  const returnDate = document.getElementById("return-date").value;

  if (
    !from ||
    !to ||
    !departureDate ||
    (tripType === "Round Trip" && !returnDate)
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  // Clear previous results
  flightResults.innerHTML = "";
  inboundFlightResults.innerHTML = "";
  flightResultsContainer.style.display = "block";
  inboundFlightResultsContainer.style.display = "none";

  try {
    // Request for outbound flights
    const outboundResponse = await axios.post(
      "http://localhost:3000/api/v1/flights/params",
      {
        departure: { departPort: from, departDate: departureDate },
        arrival: { arrivePort: to },
      }
    );

    const outboundFlights = outboundResponse.data.flights || [];

    if (outboundFlights.length === 0) {
      flightResults.innerHTML =
        '<p class="text-center">No outbound flights found.</p>';
    } else {
      outboundFlights.forEach((flight) => {
        flightResults.innerHTML += generateFlightCard(flight);
      });
    }

    // Handle inbound flights for round trips
    if (tripType === "Round Trip") {
      inboundFlightResultsContainer.style.display = "block";

      const inboundResponse = await axios.post(
        "http://localhost:3000/api/v1/flights/params",
        {
          departure: { departPort: to, departDate: returnDate },
          arrival: { arrivePort: from },
        }
      );

      const inboundFlights = inboundResponse.data.flights || [];
      if (inboundFlights.length === 0) {
        inboundFlightResults.innerHTML =
          '<p class="text-center">No inbound flights found.</p>';
      } else {
        inboundFlights.forEach((flight) => {
          inboundFlightResults.innerHTML += generateFlightCard(flight);
        });
      }
    }
  } catch (error) {
    console.error("Error fetching flights:", error);
    alert("There was an error fetching the flights. Please try again later.");
  }
});

// Helper function to generate flight cards
function generateFlightCard(flight) {
  const {
    _id,
    flightId,
    departure: { airport: from, dateTime: departureTime },
    arrival: { airport: to, dateTime: arrivalTime },
    economyPrice,
    businessPrice,
  } = flight;

  const departureDate = new Date(departureTime).toLocaleString();
  const arrivalDate = new Date(arrivalTime).toLocaleString();

  return `
        <div class="col">
            <div class="card shadow-sm">
                <div class="card-body">
                    <h5 class="card-title">Flight from ${from} to ${to}</h5>
                    <p class="card-text">
                        <strong>Departure:</strong> ${departureDate}<br>
                        <strong>Arrival:</strong> ${arrivalDate}<br>
                        <strong>Economy Price:</strong> $${economyPrice}<br>
                        <strong>Business Price:</strong> $${businessPrice}
                    </p>
                    <button class="btn btn-primary w-100 book-now-btn" data-flight-id="${flightId}" data-from="${from}" data-to="${to}" data-departure-date="${departureTime}" data-arrival-date="${arrivalTime}">Book Now</button>
                </div>
            </div>
        </div>
    `;
}

document.getElementById("flight-results").addEventListener("click", (event) => {
  if (event.target.classList.contains("book-now-btn")) {
    const flightId = event.target.getAttribute("data-flight-id");
    const from = event.target.getAttribute("data-from");
    const to = event.target.getAttribute("data-to");
    const departureDate = event.target.getAttribute("data-departure-date");
    const arrivalDate = event.target.getAttribute("data-arrival-date");

    // Build the booking URL with parameters
    const bookingUrl = `http://localhost:3000/booking/seats?flightId=${flightId}&from=${from}&to=${to}&departureDate=${encodeURIComponent(
      departureDate
    )}&arrivalDate=${encodeURIComponent(arrivalDate)}`;

    // Open the URL in a new tab
    window.open(bookingUrl, "_blank");
  }
});

document.getElementById("inbound-flight-results").addEventListener("click", (event) => {
    if (event.target.classList.contains("book-now-btn")) {
      const flightId = event.target.getAttribute("data-flight-id");
      const from = event.target.getAttribute("data-from");
      const to = event.target.getAttribute("data-to");
      const departureDate = event.target.getAttribute("data-departure-date");
      const arrivalDate = event.target.getAttribute("data-arrival-date");
  
      // Build the booking URL with parameters
      const bookingUrl = `http://localhost:3000/booking/seats?flightId=${flightId}&from=${from}&to=${to}&departureDate=${encodeURIComponent(
        departureDate
      )}&arrivalDate=${encodeURIComponent(arrivalDate)}`;
  
      // Open the URL in a new tab
      window.open(bookingUrl, "_blank");
    }
  });