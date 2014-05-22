var CronJob = require('cron').CronJob;
var FeedParser = require('feedparser');
var request = require('request');
var RssSource = require('../models/rss_source');
var Article = require('../models/article');
var pressList = require('../../config/pressList');


module.exports = function(mongoose , queue){
  var requestAndSave = function(rss){
    //console.log("start pulling rss from "+ rss.rss_code);
    var link = rss.url;
    var pressCode = rss.press_code
    var rssCode = rss.rss_code;
    var req = request(link, function (error, response, body) {
      if(error) console.log(error);
    });

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
            date = post.pubDate,
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


  var newTask = function(rss_source){
    var task = queue.create('requestRssAndSave', rss_source);
    task.save();
  }

  queue.process('requestRssAndSave', function (job, done){
    requestAndSave(job.data);
    done && done();
  })


  var pullRss = function(){
    var query = RssSource.find({});
    query.exec(function(err, results){
      for(var i in results){
        newTask(results[i]);
      }
    });
  }
  return new CronJob('00 15 * * * *', pullRss, null, false);
}


