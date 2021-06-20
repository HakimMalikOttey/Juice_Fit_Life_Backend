const partitionValidation = require('./partition_validation');
module.exports = {
  generatePartitions: async function generatePartitions(partitions){
    var compile = [];
    let plan = await new Promise(function(resolve1){
      partitions.map(async function(element){
        let wait = await partitionValidation.partitionValidation(element);
        Promise.all(wait).then(results=>{
          if(results.length > element.partitions.length){
            results.length = element.partitions.length;
          }
          results = results.filter(x=>x != null);
          compile.push({
            _id: element._id,
            partitions: results,
            name:element.name,
            type: element.type,
            explanation:element.explanation,
            hook: element.hook,
            banner:element.banner,
            date: element.date,
          });
          if(compile.length == partitions.length){
            resolve1(compile);
          }
        });
      });
    });
    return plan;
  }
}
