const User = require("../models/User");
const bcrypt = require("bcrypt");

const validateEmail = function (email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      users: users,
      amount: users.length,
      msg: "all users fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const currentUser = async (req, res) => {
  if (req.session.user) {
    res.status(200).json({ user: req.session.user });
  } else {
    res.status(404).json({ user: null });
  }
};

const createUser = async (req, res) => {
  try {
    const email = req.body.email;
    if (!validateEmail(email)) {
      res.status(400).json({ msg: "enter valid email" });
      return;
    }
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(409).json({ msg: "email already registered" });
      return;
    }
    if (req.body.password.length < 4) {
      res
        .status(400)
        .json({ msg: "password must be at least 4 characters long" });
      return;
    }
    const user = await User.create(req.body);
    res.status(201).json({ msg: "new user successfully registered" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
}; //bunch of these checks are redundant with the frontend, keeping for api

const authUser = async (req, res) => {
  try {
    const email = req.body.email;
    const pw = req.body.password;
    if (!email || !pw) {
      res.status(400).json({ msg: "email and password required" });
      return;
    }
    if (!validateEmail(email)) {
      res.status(400).json({ msg: "enter valid email" });
      return;
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ msg: `user not found with email: ${email}` });
      return;
    }
    const matchHash = await bcrypt.compare(pw, user.password);
    if (!matchHash) {
      res.status(401).json({ msg: `authentication failed, invalid password` });
      return;
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
}; //bunch of these checks are redundant with the frontend, keeping for api

const getUser = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const user = await User.findOne({ _id: userID });
    if (!user) {
      res.status(404).json({ msg: `no user with id: ${userID}` });
      return;
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const { email: userEmail } = req.params;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      res.status(404).json({ msg: `no user with email: ${userEmail}` });
      return;
    }
    res.status(200).json({ user: user });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const user = await User.findOneAndUpdate({ _id: userID }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      res.status(404).json({ msg: `no user with id: ${userID}` });
      return;
    }
    res.status(200).json({ msg: "user successfully updated" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id: userID } = req.params;
    const user = await User.findOneAndDelete({ _id: userID });
    if (!user) {
      res.status(404).json({ msg: `no user with id: ${userID}` });
      return;
    }
    res.status(200).json({ user: null, status: "success" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

module.exports = {
  getAllUsers,
  currentUser,
  createUser,
  authUser,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser,
};
