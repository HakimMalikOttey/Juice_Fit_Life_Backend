const userQuery = require(__basedir+"/query/code_query");
exports.post = async function (req,res){
  try{
    let user = await userQuery.update(
      {_id: req.body.id},
      {password: req.body.password}
    );
    if(user){
      console.log(user);
      res.send(user);
    }
    else{
      res.send(null);
    }
  }
  catch(e){
    console.log(e);
    res.sendStatus(500);
  }
}
