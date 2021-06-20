const Workouts = require("../query/workouts_query");
const Stretch = require('../query/stretch_query');
module.exports = {
  workoutsValidation: async function workoutsvalidation(elements){
    var temp = [];
    if(elements.day != null){
      elements.day.map(function(searcher) {
        if (searcher.type == "workoutunit") {
          temp.push(Workouts.find({
            _id: searcher.id
          }));
        } else if (searcher.type == "stretch") {
          temp.push(Stretch.find({
            _id: searcher.id
          }));
        } else {
          temp.push(searcher);
        }
      });
    }
    else{
      temp.push(elements);
    }
    return temp;
  }
}
