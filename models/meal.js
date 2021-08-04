const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mealSchema = {
  name: {type:String,text:true},
  meal: String,
  date: String
}

module.exports = Meals = mongoose.model("mealPlans", mealSchema);
