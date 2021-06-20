const levelRoutine = require("./level_routine");
const genWeeks = require("./generate_week");
const mealQuery = require("../query/meals_query");
module.exports = {
  partitionRoutine: async function partitionRoutine(partition){
    var levelPromise = await new Promise((resolve)=>{
      var partTemp = [];
      partition.forEach(async function(lev,levindex){
        if(lev.progression.length != 0){
          let week = await genWeeks.generateWeeks(lev.progression);
          lev.progression = week;
          var progressiontest = await levelRoutine.levelRoutine(lev.progression);
        }
        partTemp.push(lev);
        if(partTemp.length == partition.length){
          resolve(partTemp);
        }
      });
    });
    var mealPromise = await new Promise((resolve)=>{
      levelPromise.forEach(async function(element,index){
        let mealSearch = await mealQuery.find({_id:element.meal});
        if(mealSearch){
          element.meal = mealSearch;
        }
        else{
          element.meal = "";
        }
        if(index == levelPromise.length-1){
          resolve("success");
        }
      });
    });
    return levelPromise;
  }
}
