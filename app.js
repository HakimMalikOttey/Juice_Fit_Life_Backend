global.__basedir = __dirname;
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
const Schema = mongoose.Schema;
const app = express();

const signIn = require("./api/sign_in_calls");
const username = require("./api/username_calls");
const email = require("./api/email_calls");
const code = require("./api/code_calls");
const reset = require("./api/reset_calls");
const password = require("./api/password_calls");
const stretch = require("./api/stretch_calls");
const meal = require("./api/meal_calls");
const workout = require("./api/workout_calls");
const day = require("./api/day_calls");
const week = require("./api/week_calls");
const level = require("./api/level_calls");
const partition = require("./api/partition_calls");
const plan = require("./api/plan_calls");
const register = require("./api/register_calls");
const eula = require("./api/EULA_calls");
const vimeo = require("./api/vimeo_calls");

app.set('view engine', 'ejs');
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
});
const db = mongoose.connection;
app.route("/")
  .get(function(req, res) {
    console.log("Hello World");
    res.send("Hello World");
  });
app.route("/signin")
.post(signIn.signIn.post);
app.route("/username")
  .post(username.username.post);
  app.route("/email")
    .post(email.email.post);
app.route("/code/:code")
.get(code.code.get);
app.route("/password")
.post(password.password.post);
app.route("/reset")
  .post(reset.reset.post);
//Stretches
app.route("/stretch/:id")
  .get(stretch.stretch.get)
  .post(stretch.stretch.post)
  .put(stretch.stretch.put)
  .delete(stretch.stretch.delete);
app.route("/meals/duplicate/:id")
.post(meal.mealDuplicate.post);
app.route("/workout/duplicate/:id")
.post(workout.workoutDuplicate.post);
app.route("/days/duplicate/:id")
.post(day.dayDuplicate.post);
app.route("/week/duplicate/:id")
.post(week.weekDuplicate.post);
app.route("/levels/duplicate/:id")
.post(level.levelDuplicate.post);
app.route("/partitions/duplicate/:id")
.post(partition.partitionDuplicate.post);
app.route("/plans/duplicate/:id")
.post(plan.planDuplicate.post);
// for editing or viewing individual meal plans within the meal maker page
app.route("/meals/create/:id")
.get(meal.mealCreate.get);
app.route("/workout/create/:id")
.get(workout.workoutCreate.get);
app.route("/days/create/:id")
.get(day.dayCreate.get);
app.route("/week/create/:id")
.get(week.weekCreate.get);
app.route("/levels/create/:id")
.get(level.levelCreate.get);
app.route("/partitions/create/:id")
.get(partition.partitionCreate.get);
app.route("/plans/create/:id")
.get(plan.planCreate.get);
app.route("/meals/:id")
  .get(meal.meal.get)
  .put(meal.meal.put)
  .post(meal.meal.post)
  .delete(meal.meal.delete);
//Weeks
app.route("/week/:id")
  .get(week.week.get)
  .post(week.week.post)
  .put(week.week.put)
  .delete(week.week.delete);
//Days
app.route("/days/:id")
  .get(day.day.get)
  .post(day.day.post)
  .put(day.day.put)
  .delete(day.day.delete);
//Levels
app.route("/levels/:id")
  .get(level.level.get)
  .post(level.level.post)
  .put(level.level.put)
  .delete(level.level.delete);
//Partition
app.route("/partitions/:id")
  .get(partition.partition.get)
  .post(partition.partition.post)
  .put(partition.partition.put)
  .delete(partition.partition.delete);
//Plans
app.route("/plans/:id")
  .get(plan.plan.get)
  .post(plan.plan.post)
  .put(plan.plan.put)
  .delete(plan.plan.delete);
app.route("/register")
  .post(register.register.post);
app.route("/acceptEULA")
  .put(eula.eula.put);


app.route("/vimeo/:id")
.get(vimeo.vimeo.get)
.put(vimeo.vimeo.put)
app.route("/workout/:id")
  .get(workout.workout.get)
  .post(workout.workout.post)
  .put(workout.workout.put)
  .delete(workout.workout.delete)
const sslServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
}, app);
sslServer.listen(process.env.PORT, () => console.log(`Server started on port ${process.env.PORT}`))
