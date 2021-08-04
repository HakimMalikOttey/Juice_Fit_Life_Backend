const Day = require(__basedir + '/models/day');
const dayQuery = require( __basedir+"/query/day_query");
const userQuery = require(__basedir+"/query/user_query");
const idConvert = require(__basedir+"/tools/id_convert");
exports.post = async function(req,res){
  try{
    console.log(req.body);
    var failedOperations = [];
    var successfulOperations =[];
          let day = await dayQuery.findAll({_id: {$in: idConvert.idConvert(req.body.dayIDs)}});
    if(day){
      for(i = 0; i < day.length;i++){
        const newDay = new Day({
          type: day[i].type,
          name: day[i].name,
          date: day[i].date,
          day: day[i].day
        });
        let saveDay = await newDay.save();
        if(saveDay){
          let user = await userQuery.update({_id: req.params["id"]}, {$push: {days: saveDay._id}});
          if(user){
            successfulOperations.push(day[i].name);
          }
          else{
            failedOperations.push(day[i].name);
          }
        }
        else{
          failedOperations.push(day[i].name);
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
