var cheerio = require('cheerio');


module.exports = {
  processPost: function(post, pressCode){
    switch(pressCode) {
    case 15800: //蘋果
      post.description = post.title;
      post.image = "";
      return post;

    case 15801: //聯合
      if(!post.description){
        post.description = post.title;
        post.image = "";
        return post;
      }
      var $ = cheerio.load(post.description);

      if($('div').length){
        post.description = $('div').first().text();
      }else{
        post.description = post.title;
      }

      if($('img').length){
        var imgSrc = $('img').first().attr('src');
        if(imgSrc != "http://udn.com/images/udnlogo.gif"){
          post.image = imgSrc;
        }else{
          post.image = "";  
        }
      }else{
        post.image = "";
      }
      return post;

    case 15802: //自由
      post.description = post.title;
      post.image = "";
      return post;

    case 15803://中時
      post.description = post.title;
      post.image = "";        
      return post;

    case 15804: //風傳媒
      if(!post.description){
        post.description = post.title;
        post.image = "";
        return post;
      }
      var $ = cheerio.load(post.description);
      if($('img').length){
        post.image = $('img').first().attr('src');
      }else{
        post.image = "";
      }
      
      if($('div').length){
        post.description = $('div').first().text().substring(0,100) +"...";
      }else{
        post.description = post.title;
      }

      return post;  
    case 15805: //新頭殼
      if(!post.description){
        post.description = post.title;
        post.image = "";
        return post;
      }
      var $ = cheerio.load(post.description);

      if($('img').length){
        post.image = $('img').first().attr('src');
      }else{
        post.image = "";
      }

      $('br').remove();
      $('img').remove();
      post.description = $.root().text().substring(0,100) +"...";

      return post;
    case 15806: //中央社
      if(!post.description){
        post.description = post.title;
        post.image = "";
        return post;
      }
      var $ = cheerio.load(post.description);
      $('img').remove();
      post.description = $.root().text().substring(0,100) +"...";
    
      return post;  

    case 84000:
      post.description = "";
      return post;
    case 84001:
      post.description = "";
      return post;
    case 84002:
      post.description = "";
      return post;
    case 84003:
      post.description = "";
      return post;
    case 84004:
      post.description = "";
      return post;
    case 84005:
      post.description = "";
      return post;
    case 84006:
      post.description = "";
      return post;
    case 84007:
      post.description = "";
      return post;
    case 84008:
      post.description = "";
      return post;  
    default:
      return post;
    }
  }
};


















