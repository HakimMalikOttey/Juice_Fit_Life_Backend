const userQuery = require(__basedir+"/query/user_query");
exports.get = async function(req, res){
  try{
    let user = await userQuery.find({_id: req.params['id']},{vimeo:1});
    if(user){
      console.log(user);
      res.send(user);
      // console.log(user);
    }
    else{
      res.send(null)
    }
  }
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
}
exports.put = async function(req,res){
  try{
    let user = await userQuery.update({_id: req.params['id']},{$set:
      {
        vimeo: {
          access_token:req.body.access_token,
          scope:req.body.scope,
          name:req.body.name,
        },
      }});
      if(user){
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
