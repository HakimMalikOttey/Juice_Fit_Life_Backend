const mealQuery = require(__basedir+"/query/meals_query");
exports.get = async function (req,res){
  console.log(req.body);
  try{
    let meal = await mealQuery.find({_id: req.params['id']});
    if(meal){
      res.send(meal);
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
