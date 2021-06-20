const Level = require("../models/level");
module.exports = {
  findAll: async function levelSearchQuery(query){
    return Level.find(query);
  },
  find: async function levelSearchOneQuery(query){
    return Level.findOne(query);
  },
  update:async function levelUpdateQuery(query,operation){
    return Level.update(query, operation);
  },
  delete: async function levelDeleteQuery(query){
    return Level.deleteOne(query);
  }
}
