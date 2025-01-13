require("./db/connect");
const express = require("express");
const session = require("express-session");
const axios = require("axios"); //not used inside app.js so far
const app = express();
const users = require("./routes/users");
const core = require("./routes/core");
const notFound = require("./middleware/not-found");

app.set("view engine", "ejs");

//middleware
app.use(express.static("./public"));

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

//routes
app.use("/api/v1/users", users);

app.use("/", core);

app.use(notFound);

const port = 3000;

app.listen(port, console.log(`Server is listening on port ${port}...`));
