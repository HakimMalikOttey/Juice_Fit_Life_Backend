const planQuery = require(__basedir+"/query/plan_query");
const userQuery = require(__basedir+"/query/user_query");
const Plan = require(__basedir+'/models/plans');
const idConvert = require(__basedir+"/tools/id_convert");
exports.get = async function(req,res){
  let user = await userQuery.find({_id: req.params['id']});
  if(user){
    // var obj_ids = idConvert.idConvert(user.plans);
    // let partitionsearch = await planQuery.find({_id: {$in: obj_ids}});
    // let partition = await genPartition.generatePartitions(partitionsearch);
    // let parttest = await planRoutine.planRoutine(partition);
    // res.send(parttest);
    let plans;
    if (req.query.sort == 1){
      plans = await planQuery.findAllSort({_id: {$in: idConvert.idConvert(user.plans)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:1});
    }
    //Z-A
    else if(req.query.sort == 2){
      plans = await planQuery.findAllSort({_id: {$in: idConvert.idConvert(user.plans)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:-1});
    }
    //oldest
    else if(req.query.sort == 3){
      plans = await planQuery.findAllSort({_id: {$in: idConvert.idConvert(user.plans)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:1});
    }
    //youngest
    else if(req.query.sort == 4){
      plans = await planQuery.findAllSort({_id: {$in: idConvert.idConvert(user.plans)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:-1});
    }
    //normal search
    else{
      plans = await planQuery.findAll({_id: {$in: idConvert.idConvert(user.plans)},name:{$regex:`${req.query.name}`,$options:"i"}});
    }
    // var workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(user.workouts)}});
    if(plans){
      if(plans.length != 0){
        res.send(plans);
      }
      else{
        res.send(null);
      }
    }
    else{
      res.send(null);
    }
  }
}
exports.post = async function(req,res){
  try{
    const newplan = new Plan;
    newplan.name = req.body.name;
    newplan.description = req.body.description;
    newplan.explanation = req.body.explanation;
    req.body.pictures.forEach(element=>newplan.pictures.push(element));
    req.body.partitions.forEach(element=>newplan.partitions.push(element));
    let plan = await newplan.save();
    if(plan){
      let user = await userQuery.update({_id: req.params["id"]}, {$push: {"plans": plan['_id']}});
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
  let plan = await planQuery.update({_id: req.params['id']}, {$set:
    {
      name: req.body.name,
      description:req.body.description,
      explanation:req.body.explanation,
      pictures:req.body.pictures,
      partitions: req.body.partitions
    }});
    if(plan){
      res.send(plan);
    }
    else{
      res.send(false);
    }
}
exports.delete = async function(req,res){
  let user = await userQuery.update({_id: req.params['id']},{$pullAll:{plans:req.body.planIDs}});
  try{
    let plan = await planQuery.deleteMany({_id: {$in: idConvert.idConvert(req.body.planIDs)}});
    if(plan){
      res.send(plan);
    }
    else{
      res.send(false);
    }
  }
  catch(e){
    console.log(e);
    res.sendStatus(500);
  }
  // try{
  //   let plan = await planQuery.delete({_id: req.params["id"]});
  //   if(plan){
  //     res.send(plan);
  //   }
  //   else{
  //     res.send(false);
  //   }
  // }
  // catch(e){
  //   res.sendStatus(500);
  // }
}
