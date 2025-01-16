const express = require("express");
const router = express.Router();

const {
  printAll,
  index,
  signUp,
  signIn,
  booking,
  experience,
} = require("../controllers/core");

router.get("/print", printAll);

router.get("/index", index);

router.get("/signup", signUp);

router.get("/signin", signIn);

router.get("/booking", booking);

router.get("/experience", experience);

module.exports = router;
