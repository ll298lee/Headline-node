var Article = require('../models/article');


module.exports = {
  
  get_article: function(req, res){
    var category = req.param('c');
    var press = req.param('p');
    var limit = req.param('l');
    var offset = req.param('o');
    var queryParams = {};
    if(category){
      queryParams.category = category;
    }else if(press){
      queryParams.press = press;
    }else{
      res.json([]);
      return;
    } 
    var query = Article.find(queryParams).sort({date: -1});

    if(limit){
      query.limit(limit);
    }else{
      query.limit(20);
    }

    if(offset){
      query.skip(offset);
    }

    query.exec(function(err, results){
      res.json(results);  
    });
  },

  get_one: function(req, res){
    res.json({message: 'get_one: not implemented'});
  }
}
