const Stretch = require('../models/stretch');
module.exports = {
  findAll: async function stretchSearchQuery(query){
    return Stretch.find(query);
  },
  find: async function stretchSearchQuery(query){
    return Stretch.findOne(query);
  },
  update:async function stretchUpdateQuery(query, operation){
    return Stretch.updateOne(query,operation);
  },
  delete:async function stretchDeleteQuery(query){
    return Stretch.deleteOne(query);
  }
}
