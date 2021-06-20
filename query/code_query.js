const Code = require('../models/code');
module.exports = {
  find: async function daySearchQuery(query){
    return Code.findOne(query);
  },
  delete:async function dayDeleteQuery(query){
    return Code.deleteOne(query);
  },
}
