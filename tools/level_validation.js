const levelQuery = require("../query/level_query");
module.exports = {
  levelValidation: async function levelvalidation(elements){
    var temp = [];
    elements.progression.map(function(searcher) {
        temp.push(levelQuery.find({
          _id: searcher.id
        }).then());
    });
    return temp;
  }
}
