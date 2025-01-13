const axios = require("axios");

const printAll = async (req, res) => {
  try {
    const response = await axios.get("http://localhost:3000/api/v1/users");
    const data = response.data;
    res.render("printall", { users: data.users, userCount: data.users.length });
  } catch (error) {
    res.render("printall", { users: [], error: "unable to fetch users" });
    console.log(error);
  }
};

const signUp = async (req, res) => {
  res.render("signup");
};

const signIn = async (req, res) => {};

module.exports = {
  printAll,
  signUp,
  signIn,
};