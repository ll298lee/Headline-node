var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  press: Number,
  category: Number,
  title: String,
  link: String,
  date: {type: Date, default: Date.now },
  pubDate: { type: Date, default: null },
  pubdate: { type: Date, default: null },
  author: { type: String, default: null },
  description: { type: String, default: null },
  summary: { type: String, default: null },
  image: { type: String, default: null },
  guid: { type: String, default: null },
  meta:{
    views: Number,
    shares: Number
  }
});

module.exports = mongoose.model('Article', ArticleSchema);
