document.addEventListener("DOMContentLoaded", () => {
    const labelElement = document.getElementById("details");
    const flightId = labelElement.dataset.flight;
    const userId = labelElement.dataset.user;
  
    // Function to handle form submission
    async function handleSubmit(event) {
      event.preventDefault();
  
      const passengers = [];
      const flight = flightId; // Replace this with the actual flight ID you're booking
      const user = userId; // Include the user ID in the booking data
  
      // Gather all passenger data
      const passengerForms = document.querySelectorAll("#passenger-forms > div");
      passengerForms.forEach((form, index) => {
        const seatRow = form.querySelector(
          `#class-${index + 1}-row-number`
        ).value;
        const seatColumn = form.querySelector(
          `#class-${index + 1}-column-number`
        ).value;
  
        // Format seat as "A2", "B4", etc. using the correct ASCII value for column
        const seatLetter = String.fromCharCode(64 + parseInt(seatColumn)); // 'A' = 65 in ASCII, so we start at 1
        const seatNumber = `${seatLetter}${seatRow}`; // Format as "A2", "B4", etc.
  
        const passenger = {
          name: form.querySelector(`#fname-${index + 1}`).value,
          email: form.querySelector(`#mail-${index + 1}`).value,
          passportNumber: form.querySelector(`#passport-${index + 1}`).value,
          classType: form.querySelector(`#class-${index + 1}`).value,
          seatNumber: seatNumber, // Seat number in format A2, B4, etc.
        };
  
        passengers.push(passenger);
      });
  
      // Send the booking data to the backend
      try {
        console.log("Booking data:", { flight, user, passengers });
        const response = await axios.post("/api/v1/bookings", {
          flight: flight,
          user: user,
          passengers: passengers,
        });
        alert("Booking successful!");
        console.log(response.data);
        window.location.href = "/my-bookings";
      } catch (error) {
        console.error("Error booking:", error);
        alert("Error during booking!");
      }
    }
  
    // Bind the handleSubmit function to the form submit event
    document.querySelector("form").addEventListener("submit", handleSubmit);
  });  