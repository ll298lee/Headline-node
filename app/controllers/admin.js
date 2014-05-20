var mongoose = require('mongoose');
var settings = require('../../config/settings');

module.exports = {
  admin_superuser_auth: function(req, res, next){
    var excludePath = ['/login', '/logout'];
    if(excludePath.indexOf(req.path) > -1 || (req.user && req.user.superuser)){
      next();
    }else{
      req.logout();
      res.redirect('/optadmin/login');  
    }
  },


  admin_home: function(req, res){
    mongoose.connection.db.collectionNames(function (err, names) {
        for(var i=0; i<names.length; i++){
          var nameArr = names[i].name.split('.');
          nameArr.shift();
          names[i] = nameArr.join(".");
        }
        
        var context = {
          title: 'Admin',
          dbName: settings.database.db,
          collections: names
        };
        res.render('admin_home', context);  
    });
    
  },

  admin_rss_list: function(req, res){
    var context = {};
    res.render('admin_rss_list', context);  
  },

  admin_param_collection: function(req, res, next, collection){
    mongoose.connection.db.collectionNames(function (err, names) {
        for(var i=0; i<names.length; i++){
          var nameArr = names[i].name.split('.');
          nameArr.shift();
          names[i] = nameArr.join(".");
        }
        if(names.indexOf(collection) > -1){
          req.collection = collection;
          next();
        }else{
          res.send(404);
        }
    });
  },


  admin_doc_list: function(req, res){
    var context = {};
    res.render('admin_doc_list', context);  
  },

  admin_doc_detail: function(req, res){

  },

  admin_login: function(req, res){
    if(req.user){
      res.redirect('/optadmin');
    }else{
      var context = { title : 'Admin - Log in' };
      res.render('admin_login', context);  
    }
  },
  admin_logout: function(req, res){
    req.logout();
    res.redirect('/optadmin/login');
  }
}