require("./db/connect"); //includes dotenv
require("express-async-errors");
const express = require("express");
const session = require("express-session");
const app = express();
const users = require("./routes/users");
const admins = require("./routes/admins");
const flights = require("./routes/flights");
const bookings = require("./routes/bookings");
const core = require("./routes/core");
const notFound = require("./middleware/not-found");
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.set("trust proxy", 1);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());

// app.use(helmet());

// app.use(cors());

// app.use(xss());

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
