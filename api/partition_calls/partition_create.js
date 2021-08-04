const partitionQuery = require(__basedir+"/query/partition_query");
const levelQuery = require(__basedir+"/query/level_query");
const mealQuery = require(__basedir+"/query/meals_query");
const idConvert = require(__basedir+"/tools/id_convert");
exports.get = async function(req,res){
  console.log(req.body);
  try{
    let partitions = await partitionQuery.find({_id: req.params['id']});
    if(partitions){
      let partitionObject = partitions.toObject();
      var ids = [];
      partitions.progression.forEach(element => ids.push(element));
      ids = ids.filter(function(a){return a !== ''});
      let levels = await levelQuery.findAll({_id:{$in:idConvert.idConvert(ids)}});
      if(levels){
        partitionObject.progression = levels;
        if(partitions.meal !== ''){
          console.log("reached");
          let meal = await mealQuery.find({_id: partitions.meal});
          if(meal){
            partitionObject.meal = meal;
          }
          else{
            res.send(null);
          }
        }
        else{
          partitionObject.meal = null;
        }
      }
      else{
        res.send(null);
      }
      res.send(partitionObject);
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
