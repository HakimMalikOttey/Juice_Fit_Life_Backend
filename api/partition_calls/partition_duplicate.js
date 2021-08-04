const Partition = require(__basedir+'/models/partitions');
const userQuery = require(__basedir+"/query/user_query");
const partitionQuery = require(__basedir+"/query/partition_query");
exports.post = async function(req,res){
  try{
    console.log(req.body);
    var failedOperations = [];
    var successfulOperations =[];
          let partitions = await partitionQuery.findAll({_id: {$in: idConvert.idConvert(req.body.partitionIDs)}});
    if(partitions){
      for(i = 0; i < partitions.length;i++){
        const newPartition = new Partition({
          type: partitions[i].type,
          name: partitions[i].name,
          explanation: partitions[i].explanation,
          meal:partitions[i].meal,
          date: partitions[i].date,
          progression: partitions[i].progression,
        });
        let savePartition = await newPartition.save();
        if(savePartition){
          let user = await userQuery.update({_id: req.params["id"]}, {$push: {week: savePartition._id}});
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
