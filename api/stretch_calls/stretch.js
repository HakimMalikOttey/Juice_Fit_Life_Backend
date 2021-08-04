const Stretch = require(__basedir+'/models/stretch');
const userQuery = require(__basedir+"/query/code_query");
exports.get = async function (req,res){
  //Using the stretch field in the user document, search the stretch collection for the stretch documents the user created
  //this is for populating the stretch launch screen
  try{
    let user = await userQuery.find({_id: req.params['id']});
    if(user){
      let stretch = await stretchQuery.findAll({_id: {$in: idConvert.idConvert(user.stretch)}});
      if(stretch){
        res.send(stretch);
      }
      else{
        res.send(null);
      }
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

exports.post = async function (req,res){
  //Post a new stretch document to the stretch collection,
  //and then associate that document with the user by appending the new document id to the user stretch list field
  //this is for the stretch creator screen and for making a copy in the stretch launch screen
  try{
    const newStretch = new Stretch;
    newStretch.name = req.body.name;
    newStretch.type = req.body.type;
    newStretch.date = req.body.date;
    req.body.media.forEach(element => newStretch.media.push(element));
    let stretch = await newStretch.save();
    if(stretch){
      let user = await userQuery.update({_id: req.params["id"]},{$push: {"stretch": stretch['_id']}});
      if(user){
        res.send(user);
      }
      else{
        res.send(null);
      }
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

exports.put = async function (req,res){
  //Using the stretch field in the user document, search and update a document in the stretch collection
  //that has an _id that matches
  try{
    let stretch = await stretchQuery.update({
      _id: req.params['id']
    },{
      name: req.body.name,
      media: req.body.media,
      type: req.body.type,
    });
    if(stretch){
      res.send(stretch);
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

exports.delete = async function(req,res){
  try{
    let stretch = await stretchQuery.delete({_id: req.params["id"]});
    if(stretch){
      res.send(stretch);
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
