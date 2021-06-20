const levelValidation = require("./level_validation");
module.exports = {
  generateLevels: async function generateLevels(partitions){
    var compile = [];
    let parts = await new Promise(function(resolve){
      partitions.map(async function(element){
        let wait = await levelValidation.levelValidation(element);
        Promise.all(wait).then(results =>{
          for(i=0;i <results.length;i++){
            results.length = element.progression.length;
          }
          results = results.filter(x=>x != null);
          compile.push({
            _id: element._id,
            explanation:element.explanation,
            progression:results,
            name:element.name,
            type: element.type,
            meal:element.meal,
            date: element.date,
          });
          if (compile.length == partitions.length) {
            resolve(compile);
          }
        });
      });
    });
    return parts;
  }
}
