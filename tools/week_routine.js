const genWorkouts = require("./generate_workouts");
module.exports = {
  weekRoutine:async function weekRoutine(week){
    if(week.length != 0){
      let data = [];
      let wait = await new Promise(function(resolve){
        week.forEach(async function(weekdata,index){
          if(weekdata.week.length == 0){
            data.push({
              _id: weekdata._id,
              week: [],
              name: weekdata.name,
              type: weekdata.type,
              date: weekdata.date,
            });
          }
          else{
            var test = await genWorkouts.generateWorkouts(weekdata.week);
            weekdata.week = test;
            data.push(weekdata);
          }
          if(data.length == week.length){
            resolve(data);
          }
        });
      });
      return data;
    }
    else{
      return [];
    }
  }
}
