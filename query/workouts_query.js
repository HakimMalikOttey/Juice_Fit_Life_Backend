const Workouts = require('../models/workout');
module.exports = {
  update: async function workoutsUpdateQuery(query, operation) {
    return Workouts.updateOne(query, operation);
  },
  find:async function workoutsFindQuery(query) {
    return Workouts.findOne(query);
  },
  findAll:async function workoutsFindAllQuery(query) {
    return Workouts.find(query);
  },
  delete: async function workoutsDeleteQuery(query) {
    return Workouts.deleteOne(query);
  }
}
