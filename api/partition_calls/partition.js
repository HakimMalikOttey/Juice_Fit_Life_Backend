const userQuery = require(__basedir+"/query/user_query");
const partitionQuery = require(__basedir+"/query/partition_query");
const Partition = require(__basedir+'/models/partitions');
const idConvert = require(__basedir+"/tools/id_convert");
exports.get=async function(req,res){
  let user = await userQuery.find({_id: req.params['id']});
  if(user){
    let partition;
    // var obj_ids = idConvert.idConvert(user.partition);
    // let levelsearch = await partitionQuery.findAll({_id: {$in: obj_ids}});
    // let level = await genLevel.generateLevels(levelsearch);
    // var partitiontest = await partitionRoutine.partitionRoutine(level);
    // res.send(partitiontest);
    if (req.query.sort == 1){
      partition = await partitionQuery.findAllSort({_id: {$in: idConvert.idConvert(user.partition)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:1});
    }
    //Z-A
    else if(req.query.sort == 2){
      partition = await partitionQuery.findAllSort({_id: {$in: idConvert.idConvert(user.partition)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:-1});
    }
    //oldest
    else if(req.query.sort == 3){
      partition = await partitionQuery.findAllSort({_id: {$in: idConvert.idConvert(user.partition)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:1});
    }
    //youngest
    else if(req.query.sort == 4){
      partition = await partitionQuery.findAllSort({_id: {$in: idConvert.idConvert(user.partition)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:-1});
    }
    //normal search
    else{
      partition = await partitionQuery.findAll({_id: {$in: idConvert.idConvert(user.partition)},name:{$regex:`${req.query.name}`,$options:"i"}});
    }
    // var workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(user.workouts)}});
    if(partition){
      if(partition.length != 0){
        res.send(partition);
      }
      else{
        res.send(null);
      }
    }
    else{
      res.send(null);
    }
  }
  else{
    res.send(false);
  }
}
exports.post = async function(req,res){
  try{
    const newpartition = new Partition;
    newpartition.name = req.body.name;
    newpartition.description = req.body.description;
    newpartition.meal = req.body.meal;
    newpartition.date = req.body.date;
    req.body.progression.forEach(element=>newpartition.progression.push(element));
    let partition = await newpartition.save();
    if(partition){
      let user = await userQuery.update({_id: req.params["id"]}, {$push: {"partition": partition['_id']}});
      if(user){
        res.send(user);
      }
      else{
        res.send(false);
      }
    }
    else{
      res.send(false);
    }
  }
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
}
exports.put = async function(req,res){
  let partition = await partitionQuery.update({_id: req.params['id']}, {$set:
    {
      name: req.body.name,
      description: req.body.description,
      progression:req.body.progression,
      meal:req.body.meal
    }});
    if(partition){
      res.send(partition);
    }
    else{
      res.send(false);
    }
}
exports.delete = async function(req,res){
  try{
    let partition = await partitionQuery.delete({_id: req.params["id"]});
    if(partition){
      res.send(partition);
    }
    else{
      res.send(false);
    }
  }
  catch(e){
    res.sendStatus(500);
  }
}
