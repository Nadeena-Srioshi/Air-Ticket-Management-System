const express = require("express");
const router = express.Router();
const {
  getAllAdmins,
  currentAdmin,
  createAdmin,
  authAdmin,
  getAdmin,
  getAdminByEmail,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/admins");

router.get("/", getAllAdmins);

router.get("/current", currentAdmin);

router.post("/", createAdmin);

router.post("/auth", authAdmin);

router.get("/id/:id", getAdmin);

router.get("/email/:email", getAdminByEmail);

router.patch("/:id", updateAdmin);

router.delete("/:id", deleteAdmin);

module.exports = router;
