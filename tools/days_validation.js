const dayQuery = require("../query/day_query");
module.exports = {
  daysValidation: async function daysvalidation(elements){
    // console.log(elements);
    var temp = [];
    elements.data.map(function(searcher) {
      if (searcher.type == "day") {
        temp.push(dayQuery.find({
          _id: searcher.id
        }).then());
      } else {
        temp.push(searcher);
      }
    });
    return temp;
  }
}
