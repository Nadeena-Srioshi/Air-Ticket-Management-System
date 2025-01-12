require("./db/connect");
const express = require("express");
const app = express();
const users = require(`./routes/users`);
const notFound = require("./middleware/not-found");

//middleware
app.use(express.static("./public"));
app.use(express.json());

//routes
app.get("/hello", (req, res) => {
  res.send(`Hanz App`);
});

app.use("/api/v1/users", users);

app.use(notFound);

const port = 3000;

app.listen(port, console.log(`Server is listening on port ${port}...`));