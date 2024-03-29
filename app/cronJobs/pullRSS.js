var CronJob = require('cron').CronJob;
var FeedParser = require('feedparser');
var request = require('request');
var RssSource = require('../models/rss_source');
var Article = require('../models/article');
var rssUtils = require('../utils/rssUtils');


module.exports = function(mongoose , queue){
  var requestAndSave = function(rss, onDone){
    
    var link = rss.url;
    var pressCode = rss.press_code
    var rssCode = rss.rss_code;
    

    // setTimeout( function(){ 
    //   console.log(rssCode + ": time out");
    //   onDone(new Error(rssCode + ": time out"));
    // }, 60*1000*1 );

    var req = request(link, function (error, response, body) {
      if(error){
        console.log(rssCode + ": "+ error);
        onDone(new Error(rssCode + ": "+ error));
      } 
    });

    var feedparser = new FeedParser();

    req.on('response', function(res){
      var stream = this;
      if (res.statusCode != 200){
        console.log(rssCode + ": "+ 'Bad status code');
        onDone(new Error(rssCode + ": Bad status code"));
       
        return; 
      } 
      
      stream.pipe(feedparser);
    });

    
    feedparser.on('end', onDone);
    feedparser.on('readable', function(){
      var post;

      while(post = this.read()){
        // console.log(post);
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


  

  queue.process('requestRssAndSave', 3, function (job, done){
    requestAndSave(job.data, function(err){
      if(err){
        console.log(err);    
        done && done(err);
      }else{
        done && done();  
      }
    });
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
  return new CronJob('00 05 * * * *', pullRss, null, false);
}


