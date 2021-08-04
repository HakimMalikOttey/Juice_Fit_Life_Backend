const Plan = require('../models/plans');
module.exports = {
  find: async function plansFindOneQuery(query){
    return Plan.findOne(query);
  },
  deleteMany: async function plansDeleteManyQuery(query) {
    return Plan.deleteMany(query);
  },
  findAll: async function plansSearchQuery(query){
    return Plan.find(query);
  },
  update:async function plansUpdateQuery(query,operation){
    return Plan.update(query, operation);
  },
  delete:async function plansDeleteQuery(query,operation){
    return Plan.deleteOne(query, operation);
  },
  findAllSort:async function findAllSort(query,sortType){
    return Plan.find(query).sort(sortType);
  },
}
