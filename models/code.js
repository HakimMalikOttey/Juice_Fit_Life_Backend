const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const codeSchema = {
  code:String,
  id:String,
  date:{
    type:Date,
    default:Date.now(),
    index:{
      expires:'7m'
    }
  }
};
module.exports = Code = mongoose.model("codes",codeSchema);
