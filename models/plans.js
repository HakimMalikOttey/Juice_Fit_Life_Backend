const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = {
  type: String,
  name: String,
  hook: String,
  explanation:String,
  banner:String,
  partitions: [Schema.Types.Mixed],
  date: String,
}

module.exports = Plan = mongoose.model("plans",planSchema);
