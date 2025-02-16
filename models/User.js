const mongoose = require("mongoose");
const sequence = require("mongoose-sequence")(mongoose);
const hashPassword = require("../middleware/hash-password");

const validateEmail = function (email) {
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

const UserSchema = new mongoose.Schema({
  userId: {
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
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "must provide gender"],
  },
  mobileNumber: {
    type: String,
    required: [true, "must provide mobile number"],
    unique: [true, "mobile number must be unique"],
    minlength: [8, "must be at least 8 digits"],
    maxlength: [20, "must not exceed 20 digits"],
  },
  nationality: {
    type: String,
    required: [true, "must provide nationality"],
    trim: true,
  },
  passportNumber: {
    type: String,
    required: [true, "must provide passport number"],
    unique: [true, "passport number must be unique"],
    trim: true,
  },
  dob: {
    type: Date,
    required: [true, "must provide dob"],
  },
});

UserSchema.plugin(sequence, { inc_field: "userId", start_seq: 1000 });

UserSchema.pre("save", hashPassword);

module.exports = mongoose.model("User", UserSchema);
