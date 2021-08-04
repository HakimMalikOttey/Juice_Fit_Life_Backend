const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = {
  fname: String,
  lname: String,
  nName: String,
  password: String,
  phone:String,
  username: {
    type: String,
    unique: true,
    required: true
  },
  bDay: Number,
  bMonth: Number,
  bYear: Number,
  gender: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
  street: String,
  city: String,
  country: String,
  userType: String,
  zip: String,
  weight: Number,
  height: Number,
  inches: Number,
  activelevel: Number,
  goals: Number,
  eulaAccept: String,
  mealplans: [String],
  workouts: [String],
  profpic: String,
  days: [String],
  levels:[String],
  date: String,
  stretch: [String],
  partition:[String],
  plans:[String],
  week:[String],
  vimeo:{
    access_token:String,
    scope:String,
    name:String,
  }
};

module.exports = User = mongoose.model("users", userSchema);
