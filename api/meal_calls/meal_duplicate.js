const Meals = require(__basedir+'/models/meal');
const userQuery = require(__basedir+"/query/user_query");
const mealQuery = require(__basedir+"/query/meals_query");
const idConvert = require(__basedir+"/tools/id_convert");
exports.post = async function(req,res){
  try{
    console.log(req.body);
    var failedOperations = [];
    var successfulOperations =[];
          let meals = await mealQuery.findAll({_id: {$in: idConvert.idConvert(req.body.mealIDs)}});
    if(meals){
      for(i = 0; i < meals.length;i++){
        const newMeals = new Meals({
          name: meals[i].name,
          meal: meals[i].meal
        });
        let saveMeal = await newMeals.save();
        if(saveMeal){
          let user = await userQuery.update({_id: req.params["id"]}, {$push: {mealplans: saveMeal._id}});
          if(user){
            successfulOperations.push(meals[i].name);
          }
          else{
            failedOperations.push(meals[i].name);
          }
        }
        else{
          failedOperations.push(meals[i].name);
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
