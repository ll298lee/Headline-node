var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  press: Number,
  category: {type: Number, index: true },
  title: String,
  link: String,
  pubDate: { type: Date, default: Date.now },
  author: { type: String, default: null },
  description: { type: String, default: null },
  image: { type: String, default: "" },
  guid: { type: String, default: null },
  meta:{
    views: Number,
    shares: Number
  }
},{ versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


ArticleSchema.virtual('id').get(function () {
  return this._id;
});

ArticleSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj._id;
  return obj;
}




module.exports = mongoose.model('Article', ArticleSchema);
