const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = {
  type: String,
  name: String,
  day: [Schema.Types.Mixed],
  date: String,
  time: String
}

module.exports = Day = mongoose.model("days", daySchema);
