const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  currentUser,
  createUser,
  authUser,
  getUser,
  getUserByEmail,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.get("/", getAllUsers);

router.get("/current", currentUser);

router.post("/", createUser);

router.post("/auth", authUser);

router.get("/id/:id", getUser);

router.get("/email/:email", getUserByEmail);

router.patch("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
