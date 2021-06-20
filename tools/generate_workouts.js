const workoutsValidation = require("./workouts_validation");
module.exports = {
  generateWorkouts: async function generateworkouts(day){
   var compile = [];
 let daytest = await new Promise(function(resolve1){
   day.map(async function (element){
       let wait = await workoutsValidation.workoutsValidation(element);
       Promise.all(wait).then(results=>{
         if(element.day != undefined){
           if (results.length > element.day.length) {
             results.length = element.day.length;
           }

           results = results.filter(x => x != null);
           compile.push({
             _id: element._id,
             day: results,
             type: element.type,
             name: element.name,
             date: element.date,
           });
         }
         else{
           results = results.filter(x => x != null);
           compile.push({
             type: element.type,
           });
         }
           if (compile.length == day.length) {
             var test = []
             day.forEach(function(key){
               var found = false;
               compile = compile.filter(function(item){
                 if(!found && item._id == key._id){
                   test.push(item);
                   found = true;
                   return false;
                 }
                 else{
                   return true;
                 }
               });
             });
             resolve1(test);
           }
       });
     });
 });

   return daytest;
 }
}
