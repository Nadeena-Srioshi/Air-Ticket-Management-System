require("./db/connect"); //includes dotenv
const express = require("express");
const session = require("express-session");
const app = express();
const users = require("./routes/users");
const admins = require("./routes/admins");
const flights = require("./routes/flights");
const bookings = require("./routes/bookings");
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

app.use("/api/v1/admins", admins);

app.use("/api/v1/flights", flights);

app.use("/api/v1/bookings", bookings);

app.use("/", core);

app.use(notFound);

const port = 3000;

app.listen(port, console.log(`Server is listening on port ${port}...`));
