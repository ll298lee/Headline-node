var express = require('express'),
    fs = require('fs');

var ctrl_files = fs.readdirSync('./app/controllers');
var ctrls = {};
for(var i in ctrl_files){
  var name = ctrl_files[i].split('.')[0];
  ctrls[name] = require('./controllers/'+name);
}



module.exports = function(app){
  var router = express.Router();
  router.get('/article', ctrls.article.get_all);

  
  app.use('/api', router);
}
