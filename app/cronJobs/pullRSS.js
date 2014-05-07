var CronJob = require('cron').CronJob;
var FeedParser = require('feedparser');
var request = require('request');
var mongoose = require('mongoose');
var db = require('../../config/db');
mongoose.connect(db.url);


var Article = require('../models/article');
var pressList = require('../../config/pressList');




var requestAndSave = function(pressCode, rss){
  console.log("start pulling rss from "+ rss.rssCode);
  var link = rss.url;
  var rssCode = rss.rssCode;
  var req = request(link);
  var feedparser = new FeedParser();

  req.on('response', function(res){
    var stream = this;
    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));
    stream.pipe(feedparser);
  });


  feedparser.on('readable', function(){

    while(post = this.read()){
      var press = pressCode,
          category = rssCode,
          title = post.title,
          link = post.link,
          date = post.date,
          pubDate = post.pubDate,
          pubdate = post.pubdate,
          author = post.author,
          description = post.description,
          summary = post.summary,
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
              date: date,
              pubDate: pubDate,
              pubdate: pubdate,
              author: author,
              description: description,
              summary: summary,
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

var pullRss = function(){
  for (var i in pressList){
    var press = pressList[i];
    for(var j in press.rssList){
      requestAndSave(press.pressCode, press.rssList[j]);
    }
  }
}

module.exports = new CronJob('00 00 * * * *', pullRss, null, false);
