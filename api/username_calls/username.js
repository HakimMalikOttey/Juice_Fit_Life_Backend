const userQuery = require(__basedir+"/query/user_query");
exports.post = async function (req,res){
  try {
    console.log(req.body.username);
    let user = await userQuery.find({
      username: req.body.username
    });
    if (user) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (e) {
    console.log(e);
res.sendStatus(500);
  }
}
