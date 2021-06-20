const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const weekSchema = {
  type: String,
  name: String,
  data:[Schema.Types.Mixed],
  date:String
}
module.exports = Week = mongoose.model("week",weekSchema);
