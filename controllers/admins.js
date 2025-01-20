const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

const validateEmail = function (email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json({
      admins: admins,
      amount: admins.length,
      msg: "all admins fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const currentAdmin = async (req, res) => {
  if (req.session.admin) {
    res.status(200).json({ admin: req.session.admin });
  } else {
    res.status(404).json({ admin: null });
  }
};

const createAdmin = async (req, res) => {
  try {
    const email = req.body.email;
    if (!validateEmail(email)) {
      res.status(400).json({ msg: "enter valid email" });
      return;
    }
    const adminExists = await Admin.findOne({ email: email });
    if (adminExists) {
      res.status(409).json({ msg: "email already registered" });
      return;
    }
    if (req.body.password.length < 4) {
      res
        .status(400)
        .json({ msg: "password must be at least 4 characters long" });
      return;
    }
    const admin = await Admin.create(req.body);
    res.status(201).json({ msg: "new admin successfully registered" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const authAdmin = async (req, res) => {
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
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      res.status(404).json({ msg: `admin not found with email: ${email}` });
      return;
    }
    const matchHash = await bcrypt.compare(pw, admin.password);
    if (!matchHash) {
      res.status(401).json({ msg: `authentication failed, invalid password` });
      return;
    }
    req.session.isLoggedIn = true;
    req.session.admin = admin;
    res.status(200).json({ admin: admin });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "internal server error" });
  }
}; 

const getAdmin = async (req, res) => {
  try {
    const { id: adminID } = req.params;
    const admin = await Admin.findOne({ _id: adminID });
    if (!admin) {
      res.status(404).json({ msg: `no admin with id: ${adminID}` });
      return;
    }
    res.status(200).json({ admin: admin });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const getAdminByEmail = async (req, res) => {
  try {
    const { email: adminEmail } = req.params;
    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      res.status(404).json({ msg: `no admin with email: ${adminEmail}` });
      return;
    }
    res.status(200).json({ admin: admin });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id: adminID } = req.params;
    const admin = await Admin.findOneAndUpdate({ _id: adminID }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!admin) {
      res.status(404).json({ msg: `no admin with id: ${adminID}` });
      return;
    }
    res.status(200).json({ msg: "admin successfully updated" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id: adminID } = req.params;
    const admin = await Admin.findOneAndDelete({ _id: adminID });
    if (!admin) {
      res.status(404).json({ msg: `no admin with id: ${adminID}` });
      return;
    }
    res.status(200).json({ admin: null, status: "success" });
  } catch (error) {
    res.status(500).json({ msg: "internal server error" });
  }
};

module.exports = {
    getAllAdmins,
    currentAdmin,
    createAdmin,
    authAdmin,
    getAdmin,
    getAdminByEmail,
    updateAdmin,
    deleteAdmin,
  };