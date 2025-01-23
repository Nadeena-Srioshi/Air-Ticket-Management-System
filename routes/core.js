const express = require("express");
const router = express.Router();

const {
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
  errorPage,
} = require("../controllers/core");

router.get("/index", index);

router.get("/signup", signUp);

router.get("/signin", signIn);

router.get("/signout", signOut);

router.get("/profile", profile);

router.get("/my-bookings", myBookings);

router.get("/update", update);

router.get("/booking", booking);

router.get("/booking/seats", seating);

router.get("/experience", experience);

router.get("/error-page", errorPage);

module.exports = router;
