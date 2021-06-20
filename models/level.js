const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const levelSchema = {
  type:String,
  name:String,
  repeat:String,
  level:[Schema.Types.Mixed],
  date:String
}

module.exports = Level = mongoose.model("level",levelSchema);
