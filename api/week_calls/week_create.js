const weekQuery = require(__basedir+"/query/week_query");
const idConvert = require(__basedir+"/tools/id_convert");
const dayQuery = require(__basedir+"/query/day_query");
exports.get = async function (req,res){
  console.log(req.params['id']);
  try{
    let week = await weekQuery.find({_id: req.params['id']});
    if(week){
      let weekObject = week.toObject();
      var ids = [];
      week.week.forEach(element => ids.push(element.id));
      ids = ids.filter(function(a){return a !== ''});
      console.log(ids);
      let days = await dayQuery.findAll({_id: {$in: idConvert.idConvert(ids)}});
      if(days){
        console.log(days);
        for(i = 0; i < days.length; i++){
          for (a =0; a < weekObject.week.length;a++){
            if(days[i]._id == weekObject.week[a].id){
              Object.assign(weekObject.week[a],{
               name: days[i].name
             });
            }
          }
        }
        // for(i =0; i < days.length; i++){
        //    Object.assign(weekObject.week.find(function(element){
        //     return element.id == days[i]._id;
        //   }),{
        //     name: days[i].name
        //   });
        // }
        console.log(weekObject);
              res.send(weekObject);
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
