const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = {
  name:String,
  planPortionType:String,
  description:String,
  media:[{
    name:String,
    thumbnail:String,
    link:String
  }],
  workout:[{
    workoutType:String,
    repType:String,
    reps:String,
    pounds:String,
    time:String,
    timeType:String
  }]
}
module.exports = Workouts = mongoose.model("workouts", workoutSchema);
