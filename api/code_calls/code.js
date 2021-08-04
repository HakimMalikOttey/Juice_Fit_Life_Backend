const userQuery = require(__basedir+"/query/code_query");
exports.get = async function(req,res){
  try{
    let code = await codeQuery.find({
      code: req.params['code']
    });
    if(code){
      console.log(code);
      let codeDelete = await codeQuery.delete({
        _id: code._id
      });
        console.log(codeDelete);
      res.send(code.id)
    }
    else{
      // console.log(code);
      // console.log("no");
      res.send(null);
    }
  }
  catch(e){
    console.log(e);
    res.sendStatus(500);
  }
}
