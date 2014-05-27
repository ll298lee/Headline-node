var CronJob = require('cron').CronJob;
var FeedParser = require('feedparser');
var request = require('request');
var RssSource = require('../models/rss_source');
var Article = require('../models/article');
var rssUtils = require('../utils/rssUtils');


module.exports = function(mongoose , queue){
  var requestAndSave = function(rss){
    //console.log("start pulling rss from "+ rss.rss_code);
    var link = rss.url;
    var pressCode = rss.press_code
    var rssCode = rss.rss_code;
    // console.log("start pulling: "+ rssCode + "   " + new Date());
    var req = request(link, function (error, response, body) {
      if(error){
        console.log(rssCode + ": "+ error);
      } 
    });

    var feedparser = new FeedParser();

    req.on('response', function(res){
      var stream = this;
      if (res.statusCode != 200){
        console.log(rssCode + ": "+ 'Bad status code');
        return this.emit('error', new Error('Bad status code'));  
      } 
      // console.log(rssCode + ": "+ 'request ok');
      stream.pipe(feedparser);
    });


    feedparser.on('readable', function(){
      var post;

      while(post = this.read()){
        post = rssUtils.processPost(post, pressCode);
        var press = pressCode,
            category = rssCode,
            title = post.title,
            link = post.link,
            pubDate = post.pubDate,
            author = post.author,
            description = post.description,
            image = post.image,
            guid = post.guid;


        Article.findOne({ link: link, category: rssCode}, function(err, submission) {
            if(err){
              console.log(err);
            }
            if(!submission){
              submission = new Article({
                press: press,
                category: category,
                title: title,
                link: link,
                pubDate: pubDate,
                author: author,
                description: description,
                image: image,
                guid: guid
              });
              submission.save(function(err){
                if(err){
                  console.log(err);
                }
              });
            }
          }
        );
      }
    });
  };


  

  queue.process('requestRssAndSave', function (job, done){
    // setTimeout(function(){
      // console.log(job.data.rss_code);
      requestAndSave(job.data);
      done && done();
    // }, 1000);
    
  })


  var pullRss = function(){
    var query = RssSource.find({}).sort({category:-1});
    query.exec(function(err, results){
      for(var i=0;i<results.length;i++){
          var rss = results[i].toJSON();
          // console.log("add rss task: "+ rss.rss_code);
          var task = queue.create('requestRssAndSave', rss);
          task.save();
        
      }
    });
  }
  return new CronJob('00 22 * * * *', pullRss, null, false);
}


