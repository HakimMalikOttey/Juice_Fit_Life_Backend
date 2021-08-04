const workoutQuery = require(__basedir+"/query/workouts_query");
exports.get = async function(req,res){
    console.log(req.body);
    try{
      let workout = await workoutQuery.find({_id: req.params['id']});
      if(workout){
        res.send(workout);
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
