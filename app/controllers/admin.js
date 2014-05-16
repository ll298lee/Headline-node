
module.exports = {
  admin_home: function(req, res){
    var context = { title : 'Home' };
    if(req.user && req.user.superuser){
      var context = { title : 'Admin' };
      res.render('admin_home', context);  
    }else{
      req.logout();
      res.redirect('/optadmin/login');
    }
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
    res.redirect('/');
  }
}