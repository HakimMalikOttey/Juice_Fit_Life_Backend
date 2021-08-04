const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = {
  name: String,
  description: String,
  explanation:String,
  pictures:[],
  partitions: [],
}

module.exports = Plan = mongoose.model("plans",planSchema);
