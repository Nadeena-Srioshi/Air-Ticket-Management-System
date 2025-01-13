const express = require("express");
const router = express.Router();

const { printAll, signUp, signIn } = require("../controllers/core");

router.get("/print", printAll);

router.get("/signup", signUp);

router.get("/signin", signIn);

module.exports = router;
