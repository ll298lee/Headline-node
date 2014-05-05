var CronJob = require('cron').CronJob;
var FeedParser = require('feedparser');
var request = require('request');



var getUdnRss = function(){
  var req = request('http://udn.com/udnrss/focus.xml');
  // var req = request('http://www.appledaily.com.tw/rss/newcreate/kind/rnews/type/new');
  var feedparser = new FeedParser();

  req.on('response', function(res){
    var stream = this;
    if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

    stream.pipe(feedparser);
  });


  feedparser.on('readable', function(){
    var post;
    while(post = this.read()){
      console.log(post);
      console.log('---------------------------');
    }
  });
}
getUdnRss();



module.exports = new CronJob('*/5 * * * * *', getUdnRss, null, false);
