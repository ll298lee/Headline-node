var RssSource = require('../models/rss_source');

module.exports = {
  create: function(req, res){
    var press_code = req.param('press_code');
    var rss_code = req.param('rss_code');
    var rss_name = req.param('rss_name');
    var rss_url = req.param('rss_url');

    if(!press_code || !rss_name || !rss_url || !rss_code){
      res.send(404);
    }

    RssSource.findOne({rss_code: rss_code}, function(err, rss){
      if(err){
        res.send(500);
      }else if(!rss){
        var rss = new RssSource({
          press_code: press_code,
          name: rss_name,
          url: rss_url,
          rss_code: rss_code
        });
        rss.save(function(err){
          if(err){
            res.send(500);
          }else{
            res.json({message:"success"});
          }
        });
      }else{
        res.json({message: 'did not create. rss code already exist!'});
      } 
    });
    // res.send("success");

  },

  get: function(req, res){
    var press_code = req.param('press_code');
    var rss_code = req.param('rss_code');
    var name = req.param('name');

    var query_param = {};
    if(press_code){
      query_param['press_code'] = press_code
    };
    if(rss_code){
      query_param['rss_code'] = rss_code
    };
    if(name){
      query_param['name'] = name
    };
    

    var query = RssSource.find(query_param).sort({press_code:-1});
    query.exec(function(err, results){
      res.json(results);
    });
  },

  delete: function(req, res){
    RssSource.remove({
      _id: req.obj_id
    }, function(err, rss) {
      if (err)
        res.send(err);

      res.json({ message: 'Successfully deleted' });
    });

  },

  update: function(req,res){
    RssSource.findOne({_id: req.obj_id}, function(err, rss){
      if(err){
        res.send(500);
      }else if(!rss){
        res.send(404);
      }else{
        var press_code = req.param('press_code');
        var rss_code = req.param('rss_code');
        var rss_name = req.param('rss_name');
        var rss_url = req.param('rss_url');
        if(press_code){
          rss.press_code = press_code;
        }
        if(rss_code){
          rss.rss_code = rss_code;
        }
        if(rss_name){
          rss.name = rss_name;
        }
        if(rss_url){
          rss.url = rss_url;
        }
        rss.save(function(err){
          if(err){
            res.send(500);
          }else{
            res.json({message:"success"});
          }
        });
      } 
    });
  }
}









