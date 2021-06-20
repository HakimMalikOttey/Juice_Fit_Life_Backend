const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stretchSchema = {
  type: String,
  name: String,
  media: [String],
  date: String,
}
module.exports = Stretch = mongoose.model("stretches", stretchSchema);
