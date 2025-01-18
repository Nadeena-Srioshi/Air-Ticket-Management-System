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
}; //just for testing

const index = async (req, res) => {
  res.render("index", { user: req.session.user });
};

const signUp = async (req, res) => {
  res.render("signup", { user: req.session.user });
};

const signIn = async (req, res) => {
  res.render("signin", { user: req.session.user });
};

const signOut = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ msg: "failed to sign out" });
      console.log(err);
    } else {
      res.redirect(302, "/index");
    }
  });
};

const profile = async (req, res) => {
  res.render("profile", { user: req.session.user });
};

const update = async (req, res) => {
  res.render("update", { user: req.session.user });
};

const remove = async (req, res) => {
  try {
    await axios.delete(
      `http://localhost:3000/api/v1/users/${req.session.user._id}`
    );
    req.session.destroy();
    res.redirect(302, "/index");
  } catch (error) {
    res.status(500).json({ msg: "failed to delete" });
    console.log(err);
  }
};

const booking = async (req, res) => {
  res.render("booking", { user: req.session.user });
};

const experience = async (req, res) => {
  res.render("experience", { user: req.session.user });
};

module.exports = {
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
};
