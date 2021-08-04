const workoutQuery = require(__basedir+"/query/workouts_query");
const userQuery = require(__basedir+"/query/user_query");
const Workouts = require(__basedir+'/models/workout');
const idConvert = require(__basedir+"/tools/id_convert");
exports.get = async function(req, res) {
  // Using the workouts list field of the user document, search the workouts collection
  //for documents that match the ids in the list
  //This is used for the workouts editor launch screen
  try{
    let user = await userQuery.find({_id: req.params['id']});
    if(user){
      let workouts;
      if (req.query.sort == 1){
        workouts = await workoutQuery.findAllSort({_id: {$in: idConvert.idConvert(user.workouts)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:1});
      }
      //Z-A
      else if(req.query.sort == 2){
        workouts = await workoutQuery.findAllSort({_id: {$in: idConvert.idConvert(user.workouts)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:-1});
      }
      //oldest
      else if(req.query.sort == 3){
        workouts = await workoutQuery.findAllSort({_id: {$in: idConvert.idConvert(user.workouts)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:1});
      }
      //youngest
      else if(req.query.sort == 4){
        workouts = await workoutQuery.findAllSort({_id: {$in: idConvert.idConvert(user.workouts)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:-1});
      }
      //normal search
      else{
        workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(user.workouts)},name:{$regex:`${req.query.name}`,$options:"i"}});
      }
      // var workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(user.workouts)}});
      if(workouts){
        console.log(workouts);
        if(workouts.length != 0){
          res.send(workouts);
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
exports.post = async function(req, res) {
  //creates a new document within the workouts collection, and then appends the id of that newly created document
  //into the workouts list field of the user that made that document
  //used for creating in the workout creation screen and copying in the workout creation launch screen
  try{
    var media = JSON.parse(req.body.media);
    var workouts = JSON.parse(req.body.workout);
    const newWorkout = new Workouts;
    console.log(req.body);
    console.log(req.body.name);
    newWorkout.name = req.body.name;
    newWorkout.planPortionType = req.body.type;
    media.forEach(element=>newWorkout.media.push(element));
    workouts.forEach(element => newWorkout.workout.push(element));
    newWorkout.description = req.body.description;
    let workout = await newWorkout.save();
    if(workout){
      let user = await userQuery.update({_id: req.params["id"]}, {$push: {"workouts": workout['_id']}});
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
exports.put = async function(req, res) {
  console.log(req.params["id"]);
  var media = JSON.parse(req.body.media);
  var workouts = JSON.parse(req.body.workout);
  //pushes changes done from the front end to the document that has a matching id
  //used within the workout editor screen
  try {
    let user = await workoutQuery.update({
      _id: req.params["id"]
    }, {
      name: req.body.name,
      description: req.body.description,
      media: media,
      workout: workouts,
    });
    if (user) {
      res.send(user);
    } else {
      res.send(false);
    }
  } catch (e) {
    console.log(e);
res.sendStatus(500);
  }
}
exports.delete = async function(req, res) {
  let user = await userQuery.update({_id: req.params['id']},{$pullAll:{workouts:req.body.workoutIDs}});
  try{
    let workout = await workoutQuery.deleteMany({_id: {$in: idConvert.idConvert(req.body.workoutIDs)}});
    if(workout){
      res.send(workout);
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
