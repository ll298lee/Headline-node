var express = require('express'),
    passport = require('passport'),
    fs = require('fs');

var ctrl_files = fs.readdirSync('./app/controllers');
var ctrls = {};
for(var i in ctrl_files){
  var name = ctrl_files[i].split('.')[0];
  ctrls[name] = require('./controllers/'+name);
}



module.exports = function(app){
  var api_router = express.Router();
  var veiew_router = express.Router();
  /*
  * api router
  */
  
  api_router.use(function(req, res, next) {
    res.type('application/json; charset=utf-8');
    next(); 
  });

  api_router.get('/article', ctrls.article.get_article);
  

  /*
  * view router
  */
  veiew_router.get('/', ctrls.globals.not_found);
  veiew_router.get('/sass*', ctrls.globals.to_home); //exclude /sass from public route
  veiew_router.get('/optadmin',ctrls.admin.admin_home);
  veiew_router.get('/optadmin/login',ctrls.admin.admin_login);
  veiew_router.post('/optadmin/login', passport.authenticate('local',{ session: true }), function(req, res) {
      res.redirect('/optadmin');
  });
  app.get('/optadmin/logout', ctrls.admin.admin_logout);


  app.use('/api', api_router);
  app.use('', veiew_router);
}
