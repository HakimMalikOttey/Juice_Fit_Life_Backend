const UserReset = require('../models/user_reset');
module.exports = {
find: async function userNameResetFindQuery(query) {
  return UserReset.findOne(query);
}
}
