var path = require("path");
const userQuery = require(__basedir+"/query/user_query");
// const userQuery = require("./../../query/user_query");
// const userQuery = require(path.join(__dirname,"/~/query/user_query"));
exports.post = async function(req,res){
  try {
    let user = await userQuery.find({
      username: req.body.name,
      password: req.body.password
    });
    if (user) {
      console.log(user);
      res.send(user);
    } else {
      res.send(null);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
