const Plan = require('../models/plans');
module.exports = {
  find: async function plansSearchQuery(query){
    return Plan.find(query);
  },
  update:async function plansUpdateQuery(query,operation){
    return Plan.update(query, operation);
  },
  delete:async function plansDeleteQuery(query,operation){
    return Plan.deleteOne(query, operation);
  }
}
