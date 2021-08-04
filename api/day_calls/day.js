const userQuery = require(__basedir+"/query/user_query");
const dayQuery = require(__basedir+"/query/day_query");
const Day = require(__basedir+'/models/day');
const idConvert = require(__basedir+"/tools/id_convert");
exports.get = async function(req,res){
  //Using the days list field in the user document, find all documents in the days collection
  //that have an ID that matches what is in the list
  //this is for populating the days launch screen
  try{
    let user = await userQuery.find({_id: req.params['id']});
    if (user) {
      let days;
      if (req.query.sort == 1){
        days = await dayQuery.findAllSort({_id: {$in: idConvert.idConvert(user.days)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:1});
      }
      //Z-A
      else if(req.query.sort == 2){
        days = await dayQuery.findAllSort({_id: {$in: idConvert.idConvert(user.days)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:-1});
      }
      //oldest
      else if(req.query.sort == 3){
        days = await dayQuery.findAllSort({_id: {$in: idConvert.idConvert(user.days)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:1});
      }
      //youngest
      else if(req.query.sort == 4){
        days = await dayQuery.findAllSort({_id: {$in: idConvert.idConvert(user.days)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:-1});
      }
      //normal search
      else{
        days = await dayQuery.findAll({_id: {$in: idConvert.idConvert(user.days)},name:{$regex:`${req.query.name}`,$options:"i"}});
        // days = await dayQuery.findAll({_id: {$in: idConvert.idConvert(user.days)},name:{$regex:`${req.query.name}`,$options:"i"}});
      }
      // var workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(user.workouts)}});
      if(days){
        console.log(days);
        if(days.length != 0){
          res.send(days);
        }
        else{
          res.send(null);
        }
      }
      else{
        res.send(null);
      }
      // var ObjectId = require('mongodb').ObjectID;
      // var obj_ids = idConvert.idConvert(user.days);
      // let day = await dayQuery.findAll({_id: {$in: obj_ids}});
      // if (day) {
      //   //Adds depth to the list. Allows for the user to view the workouts in a day from the day creator screen
      //   //By giving more specific data on what workouts were used for the day
      //   var workouts = await genWorkouts.generateWorkouts(day);
      //   res.send(workouts);
      // }
      // else{
      //   res.send(false);
      // }
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
  //place a new day document in the days collection and take the ID of that new documents
  //and place it in the days list field of the user who created the document
  //this is for creating in the day creator screen and creating a copy in the day creator launch screen
  try{
    console.log(req.body);
    const newDay = new Day;
    newDay.name = req.body.name;
    newDay.description = req.body.description;
    req.body.day.forEach(element => newDay.day.push(element));
    let day = await newDay.save();
    if(day){
      let user = await userQuery.update({_id: req.params["id"]}, {$push: {"days": day['_id']}});
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
  //using the id within req, find a document within the day collection that has a matching id and update
  //this is used within the day creator screen
  console.log(req.params['id']);
  let day = await dayQuery.update({_id: req.params['id']}, {$set: {
    name: req.body.name,
    description:req.body.description,
    day: req.body.day
  }});
  if(day){
    res.send(day);
  }
  else{
    res.send(false);
  }
}
exports.delete = async function(req,res){
  console.log(req.body);
  let user = await userQuery.update({_id: req.params['id']},{$pullAll:{days:req.body.dayIDs}});
  try{
    let day = await dayQuery.deleteMany({_id: {$in: idConvert.idConvert(req.body.dayIDs)}});
    if(day){
      res.send(day);
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
  //   let day = await dayQuery.delete({_id: req.params["id"]});
  //   if(day){
  //     res.send(day);
  //   }
  //   else{
  //     res.send(false);
  //   }
  // }
  // catch(e){
  //   res.sendStatus(500);
  // }
}
