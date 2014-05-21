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

  //rss_source
  api_router.param('id', function(req, res, next, id){
    req.obj_id = id;
    next();
  });
  api_router.use('/rss_source', ctrls.admin.admin_superuser_api_auth);
  api_router.post('/rss_source', ctrls.rss_source.create);
  api_router.get('/rss_source', ctrls.rss_source.get);
  api_router.delete('/rss_source/:id', ctrls.rss_source.delete);
  api_router.post('/rss_source/:id', ctrls.rss_source.update);

  //article
  api_router.get('/article', ctrls.article.get_article);
  

  /*
  * view router
  */
  veiew_router.get('/', ctrls.globals.not_found);
  veiew_router.get('/sass*', ctrls.globals.to_home); //exclude /sass from public route
  
  //admins
  veiew_router.param('collection', ctrls.admin.admin_param_collection);
  veiew_router.use('/optadmin', ctrls.admin.admin_superuser_auth);
  veiew_router.get('/optadmin',ctrls.admin.admin_home);
  veiew_router.get('/optadmin/login',ctrls.admin.admin_login);
  veiew_router.get('/optadmin/collection/:collection',ctrls.admin.admin_doc_list);
  veiew_router.get('/optadmin/rsslist',ctrls.admin.admin_rss_list);
  veiew_router.post('/optadmin/login', passport.authenticate('local',{ session: true,successRedirect: '/optadmin', failureRedirect: '/optadmin/login' }));
  app.get('/optadmin/logout', ctrls.admin.admin_logout);


  app.use('/api', api_router);
  app.use('', veiew_router);
}
