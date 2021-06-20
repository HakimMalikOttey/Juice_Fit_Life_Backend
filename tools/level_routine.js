const weekRoutine = require("./week_routine");
const genDay = require("./generate_days");
module.exports = {
  levelRoutine: async function levelRoutine(level){
    var temp = [];
    const weekPromise = await new Promise((resolve)=>{
      level.forEach(async function(weekdata,index){
        let days = await genDay.generateDays(weekdata.level);
        if(days.length != 0){
          var workouttest = await weekRoutine.weekRoutine(days);
          days = workouttest;
        }
        weekdata.level = days;
        temp.push(weekdata);
        if(temp.length == level.length){
          resolve(temp);
        }
      });
    });
    return weekPromise;
  }
}
