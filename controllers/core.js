const axios = require("axios");
const path = require("path");
const fs = require("node:fs/promises");

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

const index = (req, res) => {
  const msg = req.session.msg || null;
  req.session.msg = null;
  res.render("index", {
    user: req.session.user,
    page: "home",
    msg: msg,
  });
};

const signUp = async (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.msg = "Please sign out first to sign up again";
    res.redirect(302, "/index");
    return;
  }
  const data = await readCountryInfo();
  res.render("signup", {
    user: req.session.user,
    countryInfo: data,
    sortByKey: sortByKey,
    page: "signup",
  });
};

const signIn = (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.msg = "Please sign out first to sign in again";
    res.redirect(302, "/index");
    return;
  }
  res.render("signin", { user: req.session.user, page: "signin" });
};

const signOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ msg: "failed to sign out" });
      console.log(err);
    } else {
      res.redirect(302, "/index");
    }
  });
};

const profile = (req, res) => {
  if (!req.session.isLoggedIn) {
    req.session.msg = "You must be signed in to view the profile";
    res.redirect(302, "/index");
    return;
  }
  res.render("profile", { user: req.session.user, page: "profile" });
};

const update = async (req, res) => {
  if (!req.session.isLoggedIn) {
    req.session.msg = "You must be signed in to update the profile";
    res.redirect(302, "/index");
    return;
  }
  const data = await readCountryInfo();
  res.render("update", {
    user: req.session.user,
    countryInfo: data,
    sortByKey: sortByKey,
    page: "update",
  });
};

const booking = (req, res) => {
  if (!req.session.isLoggedIn) {
    req.session.msg = "You must be signed in to book tickets";
    res.redirect(302, "/index");
    return;
  }
  res.render("booking", { user: req.session.user, page: "booking" });
};

const experience = (req, res) => {
  res.render("experience", { user: req.session.user, page: "experience" });
};

const errorPage = (req, res) => {
  res.render("error-page", { user: req.session.user, page: "error" });
};

async function readCountryInfo() {
  try {
    const filePath = path.resolve(__dirname, "../countryInfo.json");
    const fileData = await fs.readFile(filePath, "utf8");
    const countryInfo = JSON.parse(fileData);
    return countryInfo;
  } catch (error) {
    console.log("error reading json", error);
    return null;
  }
}

function sortByKey(data, key) {
  return data.sort((a, b) => {
    if (typeof a[key] === "string") {
      return a[key].localeCompare(b[key]);
    }
    return a[key] - b[key];
  });
} //copied function

module.exports = {
  printAll,
  index,
  signUp,
  signIn,
  signOut,
  profile,
  update,
  booking,
  experience,
  errorPage,
};
