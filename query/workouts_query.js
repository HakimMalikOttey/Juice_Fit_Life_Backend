const Workouts = require('../models/workout');
module.exports = {
  update: async function workoutsUpdateQuery(query, operation) {
    return Workouts.updateOne(query, operation);
  },
  deleteMany: async function workoutsDeleteManyQuery(query, operation) {
    return Workouts.deleteMany(query);
  },
  find:async function workoutsFindQuery(query) {
    return Workouts.findOne(query);
  },
  findAll:async function workoutsFindAllQuery(query) {
    return Workouts.find(query);
  },
  delete: async function workoutsDeleteQuery(query) {
    return Workouts.deleteOne(query);
  },
  findAllSort:async function findAllSort(query,sortType){
    return Workouts.find(query).sort(sortType);
  },
}
