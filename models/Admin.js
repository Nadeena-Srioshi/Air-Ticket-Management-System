const mongoose = require("mongoose");
const sequence = require("mongoose-sequence")(mongoose);
const hashPassword = require("../middleware/hash-password");

const validateEmail = function (email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const AdminSchema = new mongoose.Schema({
  adminId: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [128, "name can not be more than 128 chars"],
  },
  email: {
    type: String,
    unique: [true, "must be unique"],
    required: [true, "must provide email"],
    lowercase: true,
    trim: true,
    validate: [validateEmail, "please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "must provide password"],
    minlength: [4, "password must be at least 4 characters long"],
  },
});

AdminSchema.plugin(sequence, { inc_field: "adminId", start_seq: 8000 });

AdminSchema.pre("save", hashPassword);

module.exports = mongoose.model("Admin", AdminSchema);