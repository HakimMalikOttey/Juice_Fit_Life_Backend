module.exports = {
  idConvert: function idconvert(ids){
    var ObjectId = require('mongodb').ObjectID;
    var obj_ids = ids.map(function(id) {
      return ObjectId(id);
    });
    return obj_ids;
  }
}
