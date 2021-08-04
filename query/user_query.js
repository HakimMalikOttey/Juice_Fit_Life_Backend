
const User = require('../models/user');
module.exports = {
  find: async function userFindQuery(query,operation) {
    return User.findOne(query, operation);
  },
  update:async function userUpdateQuery(query, operation) {
    return User.updateOne(query, operation);
  }
}
