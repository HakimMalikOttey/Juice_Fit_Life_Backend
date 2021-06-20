const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = {
  type: String,
  name: String,
  media: [String],
  workout: String,
  date: String
}
module.exports = Workouts = mongoose.model("workouts", workoutSchema);
