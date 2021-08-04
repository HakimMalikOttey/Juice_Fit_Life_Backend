const userQuery = require(__basedir+"/query/user_query");
exports.post = async function (req,res){
  //Checks to see if the email exists in the database. Prevents duplicate emails
  try {
    console.log(req.body.username);
    let user = await userQuery.find({
      email: req.body.email
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
