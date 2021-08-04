const userQuery = require(__basedir+"/query/user_query");
exports.put = async function(req, res) {
  //Once the user accepts the EULA on the front end, the eula field of their documentation
  //will be editted to reflect them accepting it
  //accepting the eula will allow the user to access parts of the app that are reseved only for eula-compliant users
  //used for the EULA page
  try{
    let user = await userQuery.update({_id: req.body.id}, {eulaAccept: req.body.eulaaccept});
    if(user){
      res.send(true);
    }
    else{
      res.send(false);
    }
  }
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
}
