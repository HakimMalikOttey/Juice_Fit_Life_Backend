const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partitionSchema = {
  type: String,
  name:String,
  explanation:String,
  progression:[Schema.Types.Mixed],
  meal:String,
  date:String
}

module.exports = Partition = mongoose.model("partitions",partitionSchema);
