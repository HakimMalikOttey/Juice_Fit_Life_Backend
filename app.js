const express = require("express");
const exphbs = require("express-handlebars");
const ejs = require("ejs");
const https = require("https");
const crypto = require("crypto");
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const moment = require("moment");
var formidable = require('formidable');
const uuid = require("uuid");
var multer = require('multer');
const _ = require("lodash");
var fs = require('fs');
require('dotenv').config();
const {nanoid} = require('nanoid');
var generator = require('generate-password');
const Workouts = require('./models/workout');
const UserReset = require('./models/user_reset');
const Stretch = require('./models/stretch');
const Partition = require('./models/partitions');
const Week = require('./models/week');
const PassReset = require('./models/password_reset');
const Meals = require('./models/meal');
const Day = require('./models/day');
const User = require('./models/user');
const Plan = require('./models/plans');
const Level = require("./models/level");
const Code = require ("./models/code");
const codeQuery = require("./query/code_query");
const userQuery = require("./query/user_query");
const workoutQuery = require("./query/workouts_query");
const userRestQuery = require('./query/user_reset_query');
const passwordRestQuery = require("./query/password_reset_query");
const stretchQuery = require("./query/stretch_query");
const mealQuery = require("./query/meals_query");
const dayQuery = require("./query/day_query");
const weekQuery = require("./query/week_query");
const levelQuery = require("./query/level_query");
const partitionQuery = require("./query/partition_query");
const planQuery = require("./query/plan_query");
const transport = require("./tools/transport_creation");
const idConvert = require("./tools/id_convert");
const genWorkouts = require("./tools/generate_workouts");
const genDay = require("./tools/generate_days");
const genLevel = require("./tools/generate_levels");
const genPartition = require("./tools/generate_partitions");
const weekRoutine = require("./tools/week_routine");
const levelRoutine = require("./tools/level_routine");
const genWeeks = require("./tools/generate_week");
const partitionRoutine = require("./tools/partition_routine");
const planRoutine = require("./tools/plan_routine");
const Schema = mongoose.Schema;
var upload = multer({dest: 'uploads/'});
const app = express();
const nodemailer = require("nodemailer");
const request = require('request');
// const {
//   Client,
//   Environment
// } = require('square')
// var admin = require('firebase-admin');
// var serviceAccount = require(__dirname + "/juice-fit-life-firebase-adminsdk-4217s-4206a5b289.json");
// const API_KEY = 'AIzaSyDggLEvB0sGLF3eOP55LNPEnzwqWZGA0Ys';
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://juice-fit-life-default-rtdb.firebaseio.com"
// });
// const firebaseDB = admin.auth();
app.set('view engine', 'ejs');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// const client = new Client({
//   environment: Environment.Sandbox,
//   accessToken: process.env.SQUARE_ACCESS_TOKEN,
// })
mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
app.route("/")
  .get(function(req, res) {
    console.log("Hello World");
    res.send("Hello World");
  })
  .post(async function(req, res) {
    //Checks to see if the username and password is associated with an existing account registered in database
    try {
      let user = await userQuery.find({
        username: req.body.name,
        password: req.body.password
      });
      if (user) {
        res.send(user);
      } else {
        res.send(false);
      }
    } catch (e) {
      console.log(e);
res.sendStatus(500);
    }
  });
app.route("/signin")
.post(async function(req,res){
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
});
app.route("/username")
  .get(function(req, res) {})
  .post(async function(req, res) {
    //Checks to see if the username exists in the database. Prevents duplicate user names
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
  });
  app.route("/email")
    .get(function(req, res) {})
    .post(async function(req, res) {
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
    });

app.route("/code/:code")
.get(async function(req,res){
  // console.log( req.params['code']);
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
});
app.route("/password")
.post(async function(req,res){
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
});
app.route("/reset")
  .post(async function(req, res) {
    console.log(req.body.email);
    // console.log(req.params['email']);
    //Routine for sending the password reset email to the registered user that requested it.
    //We are generating a link by getting a general firebase link that leads to the password change screen in the app
    //while also appending the users id and password request id in order to see if the user still exists by the time they reach that screen
    //and if the link is still valid/was ever valid by the time the user clicks on it.
    //we are just using the unique id generated by mongodb in order to get the password request id
    try{
      let user = await userQuery.find(
        {
        email: req.body.email
      });
      console.log(user);
      if (user) {
        let code= nanoid(10);
        console.log(code);
        let newCode = new Code;
        newCode.code = code;
        newCode.id = user.id;
      let saveCode = await newCode.save();
          const userEmail = `${req.body.email}`;
            const output = `<p>This email was sent to you because a password reset was requested on your account.</p>
            <p> Here is your code: ${code}</a></p>
            <p>Please follow the following instructions carefully, as this code will expire in 5 minutes. Do not share this code with anyone.</p>
            <p> - Open Your Juice Fit Life App </p>
            <p> - On the log-in screen, click on 'Forgot your password? Click here!'</p>
            <p> - Click on 'Already have a pin?'</p>
            <p> - Type in the code that was emailed to you into the field that says 'Your Code' and click the 'Check Code' Button</p>
            <p> You should be able to then create a new password. Please take care to remember your password this time!</p>
            <p>If you did not request a password change then please disregard this email. Only those who have access to your email can use that code to change your password.</p>
            <p> - The Juice Fit Life Team </p>
            <p>Do not reply to this email. This email has been automatically generated.</p>`;

              // send mail with defined transport object
              let transporter = transport.transportcreation();
              transporter.sendMail({
                from: `Juice Fit Life <${process.env.EMAIL}>`, // sender address
                to: `${userEmail}`, // list of receivers
                subject: "You have requested a password reset", // Subject line
                text: "Password Reset", // plain text body
                html: output, // html body
              });
              res.send(true);
    }
    else{
      res.send(true);
    }
  }
    catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  });
//Stretches
app.route("/stretch/:id")
  .get(async function(req, res) {
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
  })
  .post(async function(req, res) {
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
  })
  .put(async function(req, res) {
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
  }).delete(async function(req,res){
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
  });
app.route("/meals/duplicate/:id")
.post(async function(req,res){
  try{
    console.log(req.body);
    var failedOperations = [];
    var successfulOperations =[];
          let meals = await mealQuery.findAll({_id: {$in: idConvert.idConvert(req.body.mealIDs)}});
    if(meals){
      for(i = 0; i < meals.length;i++){
        const newMeals = new Meals({
          name: meals[i].name,
          meal: meals[i].meal
        });
        let saveMeal = await newMeals.save();
        if(saveMeal){
          let user = await userQuery.update({_id: req.params["id"]}, {$push: {mealplans: saveMeal._id}});
          if(user){
            successfulOperations.push(meals[i].name);
          }
          else{
            failedOperations.push(meals[i].name);
          }
        }
        else{
          failedOperations.push(meals[i].name);
        }
      }
      res.send({
        failed:failedOperations,
        success:successfulOperations
      });
    }
    else{
      res.send(null);
    }
  }
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
});
app.route("/meals/create/:id")
.get(async function(req,res){
  console.log(req.body);
  try{
    let meal = await mealQuery.find({_id: req.params['id']});
    if(meal){
      res.send(meal);
    }
    else{
      res.send(null);
    }
  }
  catch(e){
    console.log(e);
res.sendStatus(500);
  }
});
app.route("/meals/:id/az/:name")
.get(async function(req,res){
  console.log("test");
  //using the meals list field in the user document, search the meals collection for documents that have a matching idea
  //for populating the meals launch screen
  try{
    let user = await userQuery.find({_id: req.params['id']});
    if(user){
      let meals = await mealQuery.findAll({_id: {$in: idConvert.idConvert(user.mealplans)}});
      if(meals){
        if(meals.length != 0){
          console.log("-------before----------");
          console.log(meals);
          const test =  meals.sort((a,b)=>a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        // await  meals.sort(
        //     function(a,b){
        //       var mealA = a.name ? a.name.toUpperCase():'';
        //       var mealB = b.name ? b.name.toUpperCase():'';
        //       mealA.localeCompare(mealB);
        //     });
            console.log("------after-----");
            console.log(test);
            res.send(test);
          console.log(meals);
        }
        else{
          res.send(null);
        }

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
});
app.route("/meals/:id")
  .get(async function(req, res) {
    //using the meals list field in the user document, search the meals collection for documents that have a matching idea
    //for populating the meals launch screen
    try{
      let user = await userQuery.find({_id: req.params['id']});
      if(user){
        let meals = await mealQuery.findAll({_id: {$in: idConvert.idConvert(user.mealplans)}});
        if(meals){
          console.log(meals);
          if(meals.length != 0){
            console.log(meals);
            res.send(meals);
          }
          else{
            res.send(null);
          }

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
  })
  .put(async function(req, res) {
    console.log( req.params['id']);
    //Find the ID that matches what is given in req in the meals collection and update that documents
    //this is for the meals creator screen
    try{
      let meals = await mealQuery.update({_id: req.params['id']},
      {
        meal: req.body.meal,
        name: req.body.name
      });
      if(meals){
        console.log("test reached");
        res.send(meals);
      }
      else{
        res.send(null);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .post(async function(req, res) {
    //place a new meals document in the meals collection, the append the ID of that new meal document
    //into this user' document' meals list field
    try{
      const newMeals = new Meals({
        name: req.body.name,
        meal: req.body.meal
      });
      let meal = await newMeals.save();
      if(meal){
        let user = await userQuery.update({_id: req.params["id"]}, {$push: {"mealplans": meal['_id']}});
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
  })
  .delete( async function(req, res) {
    try{
      let meals = await mealQuery.deleteMany({_id: {$in: idConvert.idConvert(req.body.mealIDs)}});
      if(meals){
        res.send(meals);
      }
      else{
        res.send(null);
      }
    }
    catch(e){
      console.log(e);
      res.sendStatus(500);
    }
  });
//Weeks
app.route("/week/:id")
  .get(async function(req, res) {
    try{
      let user = await userQuery.find({_id: req.params['id']});
      if(user){
        var obj_ids = idConvert.idConvert(user.week);
        let weeksearch = await weekQuery.findAll({_id: {$in: obj_ids}});
        let week = await genDay.generateDays(weeksearch);
        let test = await weekRoutine.weekRoutine(week);
        res.send(test);
      }
      else{
        res.send(null);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .post(async function(req, res) {
    //Saves a week document in the week collection, and then appends a id pointing to that document
    //in the week list field within the user document
    try{
      const newWeek = new Week;
      newWeek.type = req.body.type;
      newWeek.date = req.body.date;
      newWeek.name = req.body.name;
      req.body.data.forEach(element => newWeek.data.push(element));
      let week = await newWeek.save();
      if(week){
        let user = await userQuery.update({_id: req.params["id"]}, {$push: {"week": week['_id']}});
        if(user){
          res.send(user);
        }
        else{
          res.send(null);
        }
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .put(async function(req,res){
    let week = await weekQuery.update({_id: req.params['id']}, {$set: {name: req.body.name,data: req.body.data}});
    if(week){
      res.send(week);
    }
    else{
      res.send(false);
    }
  })
  .delete(async function(req,res){
    try{
      let week = await weekQuery.delete({_id: req.params["id"]});
      if(week){
        res.send(week);
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      res.sendStatus(500);
    }
  });
//Days
app.route("/days/:id")
  .get(async function(req, res) {
    //Using the days list field in the user document, find all documents in the days collection
    //that have an ID that matches what is in the list
    //this is for populating the days launch screen
    try{
      let user = await userQuery.find({_id: req.params['id']});
      if (user) {
        var ObjectId = require('mongodb').ObjectID;
        var obj_ids = idConvert.idConvert(user.days);
        let day = await dayQuery.findAll({_id: {$in: obj_ids}});
        if (day) {
          //Adds depth to the list. Allows for the user to view the workouts in a day from the day creator screen
          //By giving more specific data on what workouts were used for the day
          var workouts = await genWorkouts.generateWorkouts(day);
          res.send(workouts);
        }
        else{
          res.send(false);
        }
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .post(async function(req, res) {
    //place a new day document in the days collection and take the ID of that new documents
    //and place it in the days list field of the user who created the document
    //this is for creating in the day creator screen and creating a copy in the day creator launch screen
    try{
      const newDay = new Day;
      newDay.type = req.body.type;
      newDay.name = req.body.name;
      newDay.date = req.body.date;
      req.body.day.forEach(element => newDay.day.push(element));
      let day = await newDay.save();
      if(day){
        let user = await userQuery.update({_id: req.params["id"]}, {$push: {"days": day['_id']}});
        if(user){
          res.send(user);
        }
        else{
          res.send(false);
        }
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .put(async function(req, res) {
    //using the id within req, find a document within the day collection that has a matching id and update
    //this is used within the day creator screen
    let day = await dayQuery.update({_id: req.params['id']}, {$set: {name: req.body.name,day: req.body.day}});
    if(day){
      res.send(day);
    }
    else{
      res.send(false);
    }
  })
  .delete(async function(req,res){
    try{
      let day = await dayQuery.delete({_id: req.params["id"]});
      if(day){
        res.send(day);
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      res.sendStatus(500);
    }
  });
//Levels
app.route("/levels/:id")
  .get(async function(req, res) {
    try{
      let user = await userQuery.find({_id: req.params['id']});
      if(user){
        var obj_ids = idConvert.idConvert(user.levels);
        let levelsearch = await levelQuery.findAll({_id: {$in: obj_ids}});
        let week = await genWeeks.generateWeeks(levelsearch);
        console.log(week)
        let weektest = await levelRoutine.levelRoutine(week);
        res.send(weektest);
    }
  }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .post(async function(req, res) {
    try{
      const newLevel = new Level;
      newLevel.type = req.body.type;
      newLevel.name = req.body.name;
      newLevel.date = req.body.date;
      newLevel.repeat = req.body.repeat;
      req.body.level.forEach(element => newLevel.level.push(element));
      let level = await newLevel.save();
      if(level){
        let user = await userQuery.update({_id: req.params["id"]}, {$push: {"levels": level['_id']}});
        if(user){
          res.send(user);
        }
        else{
          res.send(false);
        }
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .put(async function(req,res){
    try{
      let level = await levelQuery.update({_id: req.params['id']}, {$set: {name: req.body.name,level: req.body.level,repeat:req.body.repeat}});
      if(level){
        res.send(level);
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .delete(async function(req,res){
    try{
      let level = await levelQuery.delete({_id: req.params["id"]});
      if(level){
        res.send(level);
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      res.sendStatus(500);
    }
  });
//Partition
app.route("/partitions/:id")
  .get(async function(req, res) {
    let user = await userQuery.find({_id: req.params['id']});
    if(user){
      var obj_ids = idConvert.idConvert(user.partition);
      let levelsearch = await partitionQuery.findAll({_id: {$in: obj_ids}});
      let level = await genLevel.generateLevels(levelsearch);
      var partitiontest = await partitionRoutine.partitionRoutine(level);
      res.send(partitiontest);
    }
    else{
      res.send(false);
    }
  })
  .post(async function(req,res){
    try{
      const newpartition = new Partition;
      newpartition.type = req.body.type;
      newpartition.name = req.body.name;
      newpartition.explanation = req.body.explanation;
      newpartition.meal = req.body.meal;
      newpartition.date = req.body.date;
      req.body.progression.forEach(element=>newpartition.progression.push(element));
      let partition = await newpartition.save();
      if(partition){
        let user = await userQuery.update({_id: req.params["id"]}, {$push: {"partition": partition['_id']}});
        if(user){
          res.send(user);
        }
        else{
          res.send(false);
        }
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .put(async function(req,res){
    let partition = await partitionQuery.update({_id: req.params['id']}, {$set:
      {
        name: req.body.name,
        explanation: req.body.explanation,
        progression:req.body.progression,
        meal:req.body.meal
      }});
      if(partition){
        res.send(partition);
      }
      else{
        res.send(false);
      }
  })
  .delete(async function(req,res){
    try{
      let partition = await partitionQuery.delete({_id: req.params["id"]});
      if(partition){
        res.send(partition);
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      res.sendStatus(500);
    }
  });
//Plans
app.route("/plans/:id")
  .get(async function(req, res) {
    let user = await userQuery.find({_id: req.params['id']});
    if(user){
      var obj_ids = idConvert.idConvert(user.plans);
      let partitionsearch = await planQuery.find({_id: {$in: obj_ids}});
      let partition = await genPartition.generatePartitions(partitionsearch);
      let parttest = await planRoutine.planRoutine(partition);
      res.send(parttest);
    }
  })
  .post(async function(req, res) {
    try{
      const newplan = new Plan;
      newplan.type = req.body.type;
      newplan.name = req.body.name;
      newplan.explanation = req.body.explanation;
      newplan.banner = req.body.banner;
      newplan.date = req.body.date;
      newplan.hook = req.body.hook;
      req.body.partitions.forEach(element=>newplan.partitions.push(element));
      let plan = await newplan.save();
      if(plan){
        let user = await userQuery.update({_id: req.params["id"]}, {$push: {"plans": plan['_id']}});
        if(user){
          res.send(user);
        }
        else{
          res.send(false);
        }
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .put(async function(req,res){
    let plan = await planQuery.update({_id: req.params['id']}, {$set:
      {
        name: req.body.name,
        explanation:req.body.explanation,
        banner:req.body.banner,
        partitions:req.body.partitions,
        hook: req.body.hook
      }});
      if(plan){
        res.send(plan);
      }
      else{
        res.send(false);
      }
  })
  .delete(async function(req,res){
    try{
      let plan = await planQuery.delete({_id: req.params["id"]});
      if(plan){
        res.send(plan);
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      res.sendStatus(500);
    }
  });
app.route("/email")
  .post(async function(req, res) {
    //Checks to see if a document with a matching email exists. Communicates to the user
    //that this email has already been used, so that they can place in another email
    try{
      let user = await userQuery.find({email: req.body.email});
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
  });
app.route("/register")
  .get(function(req, res) {})
  .post(async function(req, res) {
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
  });
app.route("/acceptEULA")
  .get(function(req, res) {})
  .put(async function(req, res) {
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
  });



app.route("/workout/:id")
  .get(async function(req, res) {
    // Using the workouts list field of the user document, search the workouts collection
    //for documents that match the ids in the list
    //This is used for the workouts editor launch screen
    try{
      let user = await userQuery.find({_id: req.params['id']});
      if(user){
        var workouts = await workoutQuery.findAll({_id: {$in: idConvert.idConvert(user.workouts)}});
        if(workouts){
          res.send(workouts);
        }
        else{
          res.send([]);
        }

      }
      else{
        res.send(false);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .post(async function(req, res) {
    //creates a new document within the workouts collection, and then appends the id of that newly created document
    //into the workouts list field of the user that made that document
    //used for creating in the workout creation screen and copying in the workout creation launch screen
    try{
      const newWorkout = new Workouts;
      newWorkout.type = req.body.type;
      newWorkout.name = req.body.name;
      req.body.media.forEach(element=>newWorkout.media.push(element));
      newWorkout.workout = req.body.workout;
      newWorkout.date = req.body.date;
      // const newWorkout = new Workouts({
      //   type: req.body.type,
      //   name: req.body.name,
      //   media: req.body.media,
      //   workout: req.body.workout,
      //   date: req.body.date
      // });
      let workout = await newWorkout.save();
      if(workout){
        let user = await userQuery.update({_id: req.params["id"]}, {$push: {"workouts": workout['_id']}});
        if(user){
          res.send(user);
        }
        else{
          res.send(false);
        }
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      console.log(e);
res.sendStatus(500);
    }
  })
  .put(async function(req, res) {
    //pushes changes done from the front end to the document that has a matching id
    //used within the workout editor screen
    try {
      let user = await workoutQuery.update({
        _id: req.params["id"]
      }, {
        name: req.body.name,
        media: req.body.media,
        workout: req.body.workout,
      });
      if (user) {
        res.send(user);
      } else {
        res.send(false);
      }
    } catch (e) {
      console.log(e);
res.sendStatus(500);
    }
  })
  .delete(async function(req, res) {
    try{
      let workout = await workoutQuery.delete({_id: req.params["id"]});
      if(workout){
        res.send(workout);
      }
      else{
        res.send(false);
      }
    }
    catch(e){
      res.sendStatus(500);
    }
  })
const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);
sslServer.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))
