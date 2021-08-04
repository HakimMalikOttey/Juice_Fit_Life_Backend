const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = {
  name: String,
  description:String,
  day: [{
    segmentType: String,
    id: String,
    time: String,
    timeType: String,
  }],
}

module.exports = Day = mongoose.model("days", daySchema);
