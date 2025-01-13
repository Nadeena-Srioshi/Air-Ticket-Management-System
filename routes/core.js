const express = require("express");
const router = express.Router();

const { printAll, signUp, signIn, dashboard } = require("../controllers/core");

router.get("/print", printAll);

router.get("/signup", signUp);

router.get("/signin", signIn);

router.get("/dashboard", dashboard);

module.exports = router;
