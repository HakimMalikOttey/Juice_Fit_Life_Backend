const Week = require('../query/week_query');
module.exports = {
  weekValidation: async function weekvalidation(elements){
    var temp = [];
    elements.level.map(function(searcher){
      temp.push(Week.find({
        _id:searcher.id
      }));
    });
    return temp;
  }
}
