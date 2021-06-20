const PassReset = require('../models/password_reset');
module.export = {
  find: async function passwordResetFindQuery(query) {
    return PassReset.findOne(query);
  }
}
