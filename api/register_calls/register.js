const User = require(__basedir+'/models/user');

exports.post = async function(req, res) {
  //creates a new user document and enables the user to access parts of the app restricted
  //for only registered userSchema
  //Used for the sign up screens
  try{
    const newUser = new User({
      fname: req.body.fName,
      lname: req.body.lName,
      nName: req.body.nName,
      phone:req.body.phone,
      password: req.body.password,
      username: req.body.uName,
      bDay: req.body.bDay,
      bMonth: req.body.bMonth,
      bYear: req.body.bYear,
      gender: req.body.gender,
      email: req.body.email,
      password: req.body.password,
      street: req.body.street,
      city: req.body.city,
      country: req.body.country,
      zip: req.body.zip,
      goals: req.body.goals,
      weight:req.body.weight,
      height:req.body.height,
      inches:req.body.inches,
      eulaAccept: req.body.eulaAccept,
      userType: req.body.usertype,
      profpic: req.body.profpic
    });
    let user = await newUser.save();
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
