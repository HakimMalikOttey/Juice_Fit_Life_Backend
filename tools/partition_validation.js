const Partition = require('../query/partition_query');
module.exports = {
  partitionValidation: async function partitionvalidation(elements){
    var temp = [];
    elements.partitions.map(function(searcher){
      temp.push(Partition.find({
        _id:searcher.id
      }));
    });
    return temp;
  }
}
