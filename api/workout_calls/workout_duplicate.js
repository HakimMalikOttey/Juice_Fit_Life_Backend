const Workouts = require(__basedir +'/models/workout');
const workoutQuery = require( __basedir+ "/query/workouts_query");
const userQuery = require(__basedir+"/query/user_query");
const idConvert = require(__basedir+"/tools/id_convert");
exports.post =async function(req,res) {
  try{
    console.log(req.body);
    var failedOperations = [];
    var successfulOperations =[];
          let workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(req.body.workoutIDs)}});
    if(workouts){
      for(i = 0; i < workouts.length;i++){
        const newWorkout = new Workouts({
          name: workouts[i].name,
          meal: workouts[i].meal
        });
        let saveWorkout = await newWorkout.save();
        if(saveWorkout){
          let user = await userQuery.update({_id: req.params["id"]}, {$push: {workouts: saveWorkout._id}});
          if(user){
            successfulOperations.push(workouts[i].name);
          }
          else{
            failedOperations.push(workouts[i].name);
          }
        }
        else{
          failedOperations.push(workouts[i].name);
        }
      }
      res.send({
        failed:failedOperations,
        success:successfulOperations
      });
    }
    else{
      res.send(null);
    }
  }
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
}
