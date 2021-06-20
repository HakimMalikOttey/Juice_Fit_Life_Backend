
const User = require('../models/user');
module.exports = {
  find: async function userFindQuery(query) {
    console.log("test");
    return User.findOne(query);
  },
  update:async function userUpdateQuery(query, operation) {
    return User.updateOne(query, operation);
  }
}
