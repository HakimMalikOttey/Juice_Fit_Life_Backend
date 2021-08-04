const dayQuery = require(__basedir+"/query/day_query");
const workoutQuery = require(__basedir+"/query/workouts_query");
const idConvert = require(__basedir+"/tools/id_convert");
exports.get = async function(req,res){
  console.log(req.params['id']);
  try{
    let days = await dayQuery.find({_id: req.params['id']});
    if(days){
      var dayObject = days.toObject();
      var ids = [];
      days.day.forEach(element => ids.push(element.id));
      ids = ids.filter(function(a){return a !== ''});
      let workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(ids)}});
      if(workouts){
        for(i =0; i < workouts.length; i++){
          for(a = 0; a < dayObject.day.length; a++){
            if(workouts[i]._id ==dayObject.day[a].id){
              Object.assign(dayObject.day[a],{
               name: workouts[i].name
             });
            }
          }
        }
        res.send(dayObject);
      }
      else{
        res.send(null);
      }
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
