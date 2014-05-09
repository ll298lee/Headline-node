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
  router.use(function(req, res, next) {
    
    res.type('application/json; charset=utf-8');
    next(); 
  });

  router.get('/article', ctrls.article.get_article);

  
  app.use('/api', router);
}
