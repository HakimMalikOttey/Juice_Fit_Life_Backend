const genLevel = require("./generate_levels");
const partitionRoutine = require("./partition_routine");
module.exports = {
  planRoutine: async function planRoutine(plan){
    var partitionPromise = await new Promise((resolve)=>{
      var test = [];
      plan.forEach(async function(part, index){
        if(part.partitions.length != 0){
          let partitExp = await genLevel.generateLevels(part.partitions);
          part.partitions = partitExp;
          var parttest = await partitionRoutine.partitionRoutine(part.partitions);
        }
        test.push(part);
        if(test.length == plan.length){
          resolve(plan);
        }
      });
    });
    return partitionPromise;
  }
}
