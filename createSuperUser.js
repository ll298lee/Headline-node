var mongoose = require('mongoose');
var db = require('./config/db');
var User = require('./app/models/user.js');
mongoose.connect(db.url);



var username = process.argv[2];
var password = process.argv[3];
var not_super_user = process.argv[4];

console.log("username: "+ username);
console.log("password: "+ password);
var isUserNameValid = User.validUsername(username);
if(!isUserNameValid.isValid){
  console.log(isUserNameValid.message);
  process.exit(0);
}

var isPasswordValid = User.validPassword(password);
if(!isPasswordValid.isValid){
  console.log(isPasswordValid.message);
  process.exit(0);
}

var is_super_user = !(not_super_user=="normal");

// create a user a new user
var newUser = new User({
    username: username,
    password: password,
    superuser: is_super_user
});

// save user to database
newUser.save(function(err) {
    if (err) throw err;

    // fetch user 
    User.findOne({ username: username }, function(err, user) {
        if (err) throw err;
        console.log("create success");
        process.exit();
    });
});




