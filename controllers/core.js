const path = require("path");
const fs = require("node:fs/promises");
const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

//response.data.user.name

const index = (req, res) => {
  const msg = req.session.msg || null;
  req.session.msg = null;
  res.render("index", {
    user: req.session.user,
    page: "home",
    msg: msg,
  });
};

const signUp = async (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.msg = "Please sign out first to sign up again";
    res.redirect(302, "/index");
    return;
  }
  const data = await readCountryInfo();
  res.render("signup", {
    user: req.session.user,
    countryInfo: data,
    sortByKey: sortByKey,
    page: "signup",
  });
};

const signIn = (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.msg = "Please sign out first to sign in again";
    res.redirect(302, "/index");
    return;
  }
  res.render("signin", { user: req.session.user, page: "signin" });
};

const signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ msg: "failed to sign out" });
      console.log(err);
    } else {
      res.redirect(302, "/index");
    }
  });
};

const profile = (req, res) => {
  if (!req.session.isLoggedIn) {
    req.session.msg = "You must be signed in to view the profile";
    res.redirect(302, "/index");
    return;
  }
  res.render("profile", { user: req.session.user, page: "profile" });
};

const myBookings = (req, res) => {
  if (!req.session.isLoggedIn) {
    req.session.msg = "You must be signed in to view your bookings";
    res.redirect(302, "/index");
    return;
  }
  getUserBookings(req.session.user._id)
    .then((bookings) => {
      const userBookings = bookings;
      res.render("my-bookings", {
        user: req.session.user,
        bookings: userBookings,
        page: "my-bookings",
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const update = async (req, res) => {
  if (!req.session.isLoggedIn) {
    req.session.msg = "You must be signed in to update the profile";
    res.redirect(302, "/index");
    return;
  }
  const data = await readCountryInfo();
  res.render("update", {
    user: req.session.user,
    countryInfo: data,
    sortByKey: sortByKey,
    page: "update",
  });
};

const booking = async (req, res) => {
  if (!req.session.isLoggedIn) {
    req.session.msg = "You must be signed in to book tickets";
    res.redirect(302, "/index");
    return;
  }
  try {
    const flights = await Flight.find({});

    res.render("booking", {
      user: req.session.user,
      flights: flights,
      page: "booking",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching flights");
  }
};

const seating = async (req, res) => {
  if (!req.session.isLoggedIn) {
    req.session.msg = "You must be signed in to book seats";
    res.redirect(302, "/index");
    return;
  }
  const { flightId, from, to, departureDate, arrivalDate } = req.query;
  try {
    const flight = await Flight.findOne({ flightId: flightId });
    if (!flight) {
      return res.status(404).send("Flight not found");
    }
    res.render("seating", {
      user: req.session.user,
      flight,
      from,
      to,
      departureDate,
      arrivalDate,
      page: "seating",
    });
  } catch (error) {
    console.error("Error fetching flight details:", error);
    res.status(500).send("Error fetching flight details");
  }
};

const experience = (req, res) => {
  res.render("experience", { user: req.session.user, page: "experience" });
};

const travelInfo = (req, res) => {
  res.render("travel-info", { user: req.session.user, page: "travel-info" });
};

const errorPage = (req, res) => {
  res.render("error-page", { user: req.session.user, page: "error" });
};

async function readCountryInfo() {
  try {
    const filePath = path.resolve(__dirname, "../countryInfo.json");
    const fileData = await fs.readFile(filePath, "utf8");
    const countryInfo = JSON.parse(fileData);
    return countryInfo;
  } catch (error) {
    console.log("error reading json", error);
    return null;
  }
}

function sortByKey(data, key) {
  return data.sort((a, b) => {
    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]);
    }
    return a[key] - b[key];
  });
} //copied function

async function getUserBookings(userId) {
  try {
    const bookings = await Booking.find({ user: userId })
      .populate("flight")
      .populate("user");
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Error fetching bookings");
  }
}

module.exports = {
  index,
  signUp,
  signIn,
  signOut,
  profile,
  myBookings,
  update,
  booking,
  seating,
  experience,
  travelInfo,
  errorPage,
};
