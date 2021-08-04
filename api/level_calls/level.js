const levelQuery = require(__basedir+"/query/level_query");
const Level = require(__basedir+"/models/level");
const userQuery = require(__basedir+"/query/user_query");
const idConvert = require(__basedir+"/tools/id_convert");
exports.get = async function (req,res){
  try{
    let user = await userQuery.find({_id: req.params['id']});
    if(user){
      let level;
      // var obj_ids = idConvert.idConvert(user.levels);
      // let levelsearch = await levelQuery.findAll({_id: {$in: obj_ids}});
      // let week = await genWeeks.generateWeeks(levelsearch);
      // console.log(week)
      // let weektest = await levelRoutine.levelRoutine(week);
      // res.send(weektest);
      if (req.query.sort == 1){
        level = await levelQuery.findAllSort({_id: {$in: idConvert.idConvert(user.levels)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:1});
      }
      //Z-A
      else if(req.query.sort == 2){
        level = await levelQuery.findAllSort({_id: {$in: idConvert.idConvert(user.levels)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:-1});
      }
      //oldest
      else if(req.query.sort == 3){
        level = await levelQuery.findAllSort({_id: {$in: idConvert.idConvert(user.levels)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:1});
      }
      //youngest
      else if(req.query.sort == 4){
        level = await levelQuery.findAllSort({_id: {$in: idConvert.idConvert(user.levels)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:-1});
      }
      //normal search
      else{
        level = await levelQuery.findAll({_id: {$in: idConvert.idConvert(user.levels)},name:{$regex:`${req.query.name}`,$options:"i"}});
      }
      // var workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(user.workouts)}});
      if(level){
        if(level.length != 0){
          res.send(level);
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
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
}
exports.post = async function(req,res){
  try{
    const newLevel = new Level;
    newLevel.type = req.body.type;
    newLevel.name = req.body.name;
    newLevel.date = req.body.date;
    newLevel.repeat = req.body.repeat;
    req.body.level.forEach(element => newLevel.level.push(element));
    let level = await newLevel.save();
    if(level){
      let user = await userQuery.update({_id: req.params["id"]}, {$push: {"levels": level['_id']}});
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
  try{
    let level = await levelQuery.update({_id: req.params['id']}, {$set: {name: req.body.name,level: req.body.level,repeat:req.body.repeat}});
    if(level){
      res.send(level);
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
exports.delete = async function(req,res){
  try{
    let level = await levelQuery.delete({_id: req.params["id"]});
    if(level){
      res.send(level);
    }
    else{
      res.send(false);
    }
  }
  catch(e){
    res.sendStatus(500);
  }
}
