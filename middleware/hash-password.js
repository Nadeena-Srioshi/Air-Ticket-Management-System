const bcrypt = require("bcrypt");

const hashPassword = async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
}; //can not be an arrow function due to 'this'

module.exports = hashPassword;
