const Partition = require('../models/partitions');
module.exports = {
  findAll:async function partitionSearchQuery(query){
    return Partition.find(query);
  },
  find:async function partitionSearchQuery(query){
    return Partition.findOne(query);
  },
  update: async function partitionUpdateQuery(query,operation){
    return Partition.update(query,operation);
  },
  delete:async function partitionDeleteQuery(query){
    return Partition.deleteOne(query);
  }
}
