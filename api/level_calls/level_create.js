const levelQuery = require(__basedir+"/query/level_query");
const idConvert = require(__basedir+"/tools/id_convert");
const weekQuery = require(__basedir+"/query/week_query");
exports.get = async function (req,res){
  console.log(req.body);
  try{
    let level = await levelQuery.find({_id: req.params['id']});
    if(level){
      var levelObject = level.toObject();
      var ids = [];
      level.level.forEach(element => ids.push(element));
      let week = await weekQuery.findAll({_id:{$in:idConvert.idConvert(ids)}});
      if(week){
        for(i = 0; i < week.length; i++){
          for (a =0; a < levelObject.level.length;a++){
            if(week[i]._id == levelObject.level[a]){
              levelObject.level[a] = week[i];
            }
          }
        }
        console.log(levelObject);
        res.send(levelObject);
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
