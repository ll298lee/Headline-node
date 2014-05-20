var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RssSchema = new Schema({
  press_code: Number,
  name: String,
  rss_code: Number,
  url: String
  

  


  
  
},{ versionKey: false,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});


RssSchema.virtual('id').get(function () {
  return this._id;
});

RssSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj._id;
  return obj;
}




module.exports = mongoose.model('RssSource', RssSchema);
