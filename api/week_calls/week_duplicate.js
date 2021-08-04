const Week = require(__basedir+'/models/week');
const weekQuery = require(__basedir+"/query/week_query");
const userQuery = require(__basedir+"/query/user_query");
const idConvert = require(__basedir+"/tools/id_convert");
exports.post = async function(req,res){
  try{
    console.log(req.body);
    var failedOperations = [];
    var successfulOperations =[];
          let week = await weekQuery.findAll({_id: {$in: idConvert.idConvert(req.body.weekIDs)}});
    if(week){
      for(i = 0; i < week.length;i++){
        // const newWeek = new Week({
        //   type: day[i].type,
        //   date: day[i].date,
        //   name: day[i].name,
        // });
        const newWeek = new Week;
        newWeek.name = week[i].name;
        week[i].week.forEach(element => newWeek.week.push(element));
        let saveWeek = await newWeek.save();
        if(saveWeek){
          let user = await userQuery.update({_id: req.params["id"]}, {$push: {week: saveWeek._id}});
          if(user){
            successfulOperations.push(week[i].name);
          }
          else{
            failedOperations.push(week[i].name);
          }
        }
        else{
          failedOperations.push(week[i].name);
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
