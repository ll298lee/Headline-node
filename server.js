var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    settings = require('./config/settings'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy
    
    ;

//confugure app ================================
app.set('views', __dirname + '/app/templates');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(cookieParser(settings.cookie_parser_secret));
var db = require('./config/db');
var mongoosedb = mongoose.connect(db.url);

var MongoStore = require('connect-mongo')(session);
app.use(session({
  cookie: {maxAge: settings.sesstion_max_age},
  secret: settings.session_cookie_secret,
  store: new MongoStore({
    db: db.db,
    host: db.host,
    mongoose_connection: mongoosedb.connections[0]
  })
}));

app.use(passport.initialize());
app.use(passport.session());




//setup passport ===============================
var User = require('./app/models/user');
passport.use(new LocalStrategy(function(username, password, done){
  User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }

      // test a matching password
      user.comparePassword(password, function(err, isMatch) {
          if (err) { return done(err); }
          if(isMatch){
            return done(null, user);
          }else{
            return done(null, false);  
          }
      });
  });
}));
passport.serializeUser(function(user, done){
  done(null, user.id);
});
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




//setup routers ================================
require('./app/routes')(app);
app.use(express.static(__dirname + '/public'));

//start the app ================================
var port = process.env.PORT || settings.httpPort;
app.listen(port);
console.log('Start server on port: ' + port);
