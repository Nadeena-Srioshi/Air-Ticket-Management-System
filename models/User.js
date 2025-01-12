const mongoose = require("mongoose");

const validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "must provide name"],
    trim: true,
    maxlength: [64, "name can not be more than 64 chars"],
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

module.exports = mongoose.model("User", UserSchema);
