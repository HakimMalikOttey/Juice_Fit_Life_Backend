const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partitionSchema = {
  name:String,
  description:String,
  progression:[],
  meal:String,
}

module.exports = Partition = mongoose.model("partitions",partitionSchema);
