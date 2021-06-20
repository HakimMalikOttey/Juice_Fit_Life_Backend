const Day = require('../models/day');
module.exports = {
  findAll: async function daySearchQuery(query){
    return Day.find(query);
  },
  find: async function daySearchQuery(query){
    return Day.findOne(query);
  },
  delete:async function dayDeleteQuery(query){
    return Day.deleteOne(query);
  },
  update:async function dayUpdateQuery(query, operation){
    return Day.update(query, operation);
  }
}
