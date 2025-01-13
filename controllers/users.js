const User = require("../models/User");
const axios = require("axios");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users: users, amount: users.length });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user: user });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const authUser = async (req, res) => {
  try {
    const email = req.body.email;
    const pw = req.body.password;
    if (!email || !pw) {
      res.status(400).json({ msg: "email and password required" });
      return;
    }
    let user;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/users/email/${email}`
      );
      user = response.data.user;
    } catch (error) {
      res.status(404).json({ msg: `user not found with email: ${email}` });
      return;
    }
    if (pw !== user.password) {
      res.status(401).json({ msg: `authentication failed, invalid password` });
      return;
    }
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
};

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
    res.status(500).json({ msg: error });
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
    res.status(500).json({ msg: error });
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
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ msg: error });
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
    res.status(500).json({ msg: error });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  authUser,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser,
};
