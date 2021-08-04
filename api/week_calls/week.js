const userQuery = require(__basedir+"/query/user_query");
const weekQuery = require(__basedir+"/query/week_query");
const Week = require(__basedir+'/models/week');
const idConvert = require(__basedir+"/tools/id_convert");
exports.get = async function(req,res){
  try{
    let user = await userQuery.find({_id: req.params['id']});
    if(user){
      let weeks;
      if (req.query.sort == 1){
        weeks = await weekQuery.findAllSort({_id: {$in: idConvert.idConvert(user.week)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:1});
      }
      //Z-A
      else if(req.query.sort == 2){
        weeks = await weekQuery.findAllSort({_id: {$in: idConvert.idConvert(user.week)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:-1});
      }
      //oldest
      else if(req.query.sort == 3){
        weeks = await weekQuery.findAllSort({_id: {$in: idConvert.idConvert(user.week)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:1});
      }
      //youngest
      else if(req.query.sort == 4){
        weeks = await weekQuery.findAllSort({_id: {$in: idConvert.idConvert(user.week)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:-1});
      }
      //normal search
      else{
        weeks = await weekQuery.findAll({_id: {$in: idConvert.idConvert(user.week)},name:{$regex:`${req.query.name}`,$options:"i"}});
      }
      // var workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(user.workouts)}});
      if(weeks){
        if(weeks.length != 0){
          res.send(weeks);
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
      res.send(null);
    }
  }
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
}
exports.post = async function(req,res){
  //Saves a week document in the week collection, and then appends a id pointing to that document
  //in the week list field within the user document
  try{
    const newWeek = new Week;
    newWeek.name = req.body.name;
    req.body.week.forEach(element => newWeek.week.push(element));
    let week = await newWeek.save();
    if(week){
      let user = await userQuery.update({_id: req.params["id"]}, {$push: {"week": week['_id']}});
      if(user){
        res.send(user);
      }
      else{
        res.send(null);
      }
    }
  }
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
}
exports.put = async function(req,res){
  console.log(req.body);
  let week = await weekQuery.update({_id: req.params['id']}, {$set: {name: req.body.name,week: req.body.week}});
  if(week){
    res.send(week);
  }
  else{
    res.send(false);
  }
}
exports.delete = async function(req,res){
  let user = await weekQuery.update({_id: req.params['id']},{$pullAll:{days:req.body.weekIDs}});
  try{
    let week = await weekQuery.deleteMany({_id: {$in: idConvert.idConvert(req.body.weekIDs)}});
    if(week){
      res.send(week);
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
    //   let week = await weekQuery.delete({_id: req.params["id"]});
    //   if(week){
    //     res.send(week);
    //   }
    //   else{
    //     res.send(false);
    //   }
    // }
    // catch(e){
    //   res.sendStatus(500);
    // }
}
