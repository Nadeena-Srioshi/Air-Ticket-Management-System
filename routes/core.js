const express = require("express");
const router = express.Router();

const {
  printAll,
  index,
  signUp,
  signIn,
  signOut,
  profile,
  update,
  remove,
  booking,
  experience,
} = require("../controllers/core");

router.get("/print", printAll);

router.get("/index", index);

router.get("/signup", signUp);

router.get("/signin", signIn);

router.get("/signout", signOut);

router.get("/profile", profile);

router.get("/update", update);

router.get("/remove", remove);

router.get("/booking", booking);

router.get("/experience", experience);

module.exports = router;
