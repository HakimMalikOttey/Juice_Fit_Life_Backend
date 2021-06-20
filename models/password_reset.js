const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordResetSchema = {
  linkdate: String,
}

module.exports = PassReset = mongoose.model("passwordRests", passwordResetSchema);
