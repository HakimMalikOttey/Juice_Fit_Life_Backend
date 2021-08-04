const Level = require(__basedir +"/models/level");
const levelQuery = require(__basedir +"/query/level_query");
const userQuery = require(__basedir+"/query/user_query");
exports.post = async function(req,res){
  try{
    console.log(req.body);
    var failedOperations = [];
    var successfulOperations =[];
          let level = await levelQuery.findAll({_id: {$in: idConvert.idConvert(req.body.levelIDs)}});
    if(level){
      for(i = 0; i < level.length;i++){
        const newlevel = new Level({
          type: day[i].type,
          name: day[i].name,
          date: day[i].date,
          repeat:day[i].repeat
        });
        let saveLevel = await newlevel.save();
        if(saveLevel){
          let user = await userQuery.update({_id: req.params["id"]}, {$push: {week: saveLevel._id}});
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
