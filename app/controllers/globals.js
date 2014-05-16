
module.exports = {
  to_home: function(req, res){
    res.redirect('/');
  },
  not_found: function(req, res){
    res.send(404, '404');
  }
}