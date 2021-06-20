const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userResetSchema = {
  linkdate: String,
}

module.exports = UserReset = mongoose.model("userRests", userResetSchema);
