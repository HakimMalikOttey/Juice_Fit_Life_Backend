const Plan = require(__basedir+'/models/plans');
const userQuery = require(__basedir+"/query/user_query");
const planQuery = require(__basedir+"/query/plan_query");
const idConvert = require(__basedir+"/tools/id_convert");
exports.post = async function(req,res){
  try{
    console.log(req.body);
    var failedOperations = [];
    var successfulOperations =[];
          let plans = await planQuery.findAll({_id: {$in: idConvert.idConvert(req.body.planIDs)}});
    if(plans){
      for(i = 0; i < plans.length;i++){
        const newplan = new Plan;
        newplan.name = plans[i].name;
        newplan.description = plans[i].description;
        newplan.explanation = plans[i].explanation;
        req.body.links.forEach(element=>newplan.pictures.push(element));
        plans[i].partitions.forEach(element=>newplan.partitions.push(element));
        let planCopy = await newplan.save();
        if(planCopy){
          let user = await userQuery.update({_id: req.params["id"]}, {$push: {plans: planCopy._id}});
          if(user){
            successfulOperations.push(planCopy.name);
          }
          else{
            failedOperations.push(planCopy.name);
          }
        }
        else{
          failedOperations.push(planCopy.name);
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
