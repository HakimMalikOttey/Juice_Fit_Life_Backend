const daysValidation = require("./days_validation");
module.exports = {
  generateDays: async function generatedays(week){
   var compile = [];
   if(week.length != 0){
  let daytest = await new Promise(function(resolve1){
      week.map(async function (element){
        // console.log("!!!!!!!!!!");
        // console.log(element);
        // console.log("!!!!!!!!!!");
          let wait = await daysValidation.daysValidation(element);
          console.log("test");
          Promise.all(wait).then(results=>{
              if (results.length > element.data.length) {
                results.length = element.data.length;
              }

              results = results.filter(x => x != null);
              compile.push({
                _id: element._id,
                week: results,
                name:element.name,
                type: element.type,
                date: element.date,
                weekrep:element.weekrep
              });
              if (compile.length == week.length) {
                resolve1(compile);
              }
          });
        });
  });
  return daytest;
  }
  else{
    return [];
  }
  }
}
