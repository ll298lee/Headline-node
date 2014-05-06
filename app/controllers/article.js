var Article = require('../models/article');


module.exports = {
  get_all: function(req, res){
    Article.find({}).sort({date: -1}).limit(20).exec(function(err, results){
      res.json(results);  
    });


    
  },

  get_one: function(req, res){
    res.json({message: 'get_one: not implemented'});
  }
}
