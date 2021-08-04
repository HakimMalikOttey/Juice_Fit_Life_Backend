const planQuery = require(__basedir +"/query/plan_query");
const idConvert = require(__basedir+"/tools/id_convert");
const partitionQuery = require(__basedir+"/query/partition_query");
exports.get = async function (req,res){
  console.log(req.body);
  try{
    let plans = await planQuery.find({_id: req.params['id']});
    if(plans){
      let plansObject = plans.toObject();
      var ids = [];
      var ObjectId = require('mongodb').ObjectID;
      plansObject.partitions.forEach(async function(element){
        ids.push(partitionQuery.find({_id:ObjectId(element)}));
      });
      var idPromise = await Promise.all(ids);
      plansObject.partitions = idPromise;
      res.send(plansObject);
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
