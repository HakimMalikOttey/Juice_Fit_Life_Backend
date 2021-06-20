const weekValidation = require('./week_validation');
module.exports = {
  generateWeeks: async function generateweeks(levels){
    // console.log(levels[0].level);
    var compile = [];
    let week = await new Promise(function(resolve1){
      levels.map(async function(element){
        let wait = await weekValidation.weekValidation(element);
        Promise.all(wait).then(results=>{
          console.log("!!!!!!!!!");
          console.log(results);
          console.log("!!!!!!!!!");
          for(i = 0; i < results.length; i++){
            if(results[i] != null){
              let test = {
                data: results[i].data,
                _id: results[i]._id,
                type:results[i].type,
                date:results[i].date,
                name:results[i].name,
                weekrep:element.level[i].weekrep
              }
              results[i] = test;
            }
          }
          if(results.length > element.level.length){
            results.length = element.level.length;
          }
          results = results.filter(x=>x != null);
          compile.push({
            _id: element._id,
            level: results,
            name:element.name,
            type: element.type,
            repeat:element.repeat,
            date: element.date,
          });
          if(compile.length == levels.length){
            resolve1(compile);
          }
        });
      });
    });
    return week;
  }
}
