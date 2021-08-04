const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const weekSchema = {
  name: String,
  week:[{
    dayType:String,
    id:String
  }],
}
module.exports = Week = mongoose.model("week",weekSchema);
