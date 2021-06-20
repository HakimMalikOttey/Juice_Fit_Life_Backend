const Meals = require('../models/meal');
module.exports = {
  findAll: async function mealsSearchQuery(query){
    return Meals.find(query);
  },
  find: async function mealsSearchOneQuery(query){
    return Meals.findOne(query);
  },
  update: async function mealUpdateQuery(query, operation){
    return Meals.updateOne(query, operation);
  },
  delete:async function mealDeleteQuery(query, operation){
    return Meals.deleteOne(query);
  },
  deleteMany:async function mealDealeatManyQuery(query){
    return Meals.deleteMany(query);
  }
}
