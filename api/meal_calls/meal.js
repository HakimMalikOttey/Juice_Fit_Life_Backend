const mealQuery = require(__basedir+"/query/meals_query");
const userQuery = require(__basedir+"/query/user_query");
const idConvert = require(__basedir+"/tools/id_convert");
const Meals = require(__basedir+'/models/meal');
exports.get = async function (req,res){
  console.log("reached");
  console.log(req.query);
  //using the meals list field in the user document, search the meals collection for documents that have a matching idea
  //for populating the meals launch screen
  try{
    console.log(req.query.name)
    let user = await userQuery.find({_id: req.params['id']});
    if(user){
      let meals;
      //A-Z
      if (req.query.sort == 1){
        meals = await mealQuery.findAllSort({_id: {$in: idConvert.idConvert(user.mealplans)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:1});
      }
      //Z-A
      else if(req.query.sort == 2){
        meals = await mealQuery.findAllSort({_id: {$in: idConvert.idConvert(user.mealplans)},name:{$regex:`${req.query.name}`,$options:"i"}},{name:-1});
      }
      //oldest
      else if(req.query.sort == 3){
        meals = await mealQuery.findAllSort({_id: {$in: idConvert.idConvert(user.mealplans)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:1});
      }
      //youngest
      else if(req.query.sort == 4){
        meals = await mealQuery.findAllSort({_id: {$in: idConvert.idConvert(user.mealplans)},name:{$regex:`${req.query.name}`,$options:"i"}},{$natural:-1});
      }
      //normal search
      else{
        meals = await mealQuery.findAll({_id: {$in: idConvert.idConvert(user.mealplans)},name:{$regex:`${req.query.name}`,$options:"i"}});
      }
      // let meals = await mealQuery.findAll({_id: {$in: idConvert.idConvert(user.mealplans)}});
      if(meals){
        console.log(meals);
        if(meals.length != 0){
          res.send(meals);
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
exports.put = async function(req,res){
    console.log( req.params['id']);
    //Find the ID that matches what is given in req in the meals collection and update that documents
    //this is for the meals creator screen
    try{
      let meals = await mealQuery.update({_id: req.params['id']},
      {
        meal: req.body.meal,
        name: req.body.name
      });
      if(meals){
        console.log("test reached");
        res.send(meals);
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
  //place a new meals document in the meals collection, the append the ID of that new meal document
  //into this user' document' meals list field
  try{
    const newMeals = new Meals({
      name: req.body.name,
      meal: req.body.meal
    });
    let meal = await newMeals.save();
    if(meal){
      let user = await userQuery.update({_id: req.params["id"]}, {$push: {"mealplans": meal['_id']}});
        if(user){
          res.send(user);
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
exports.delete = async function(req,res){
  console.log(req.body);
  try{
    let user = await userQuery.update({_id: req.params['id']},{$pullAll:{mealplans:req.body.mealIDs}});
    if(user){
      let meals = await mealQuery.deleteMany({_id: {$in: idConvert.idConvert(req.body.mealIDs)}});
      if(meals){
        res.send(meals);
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
