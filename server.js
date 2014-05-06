var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    settings = require('./config/settings');


//confugure app ================================
app.use(bodyParser());

var db = require('./config/db');
mongoose.connect(db.url);


//setup routers ================================
require('./app/routes')(app);

//start the app ================================
var port = process.env.PORT || settings.httpPort;
app.listen(port, '0.0.0.0');
console.log('Start server on port: ' + port);
