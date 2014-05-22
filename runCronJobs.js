
var mongoose = require('mongoose');
var kue = require('kue');
var queue = kue.createQueue();
var settings = require('./config/settings');

mongoose.connect(settings.database.url);
var fs = require('fs');

var job_files = fs.readdirSync('./app/cronJobs');
var jobs = [];
for(var i in job_files){
  var name = job_files[i].split('.')[0];
  jobs.push(require('./app/cronJobs/'+name)(mongoose, queue));
}

for(var i in jobs){
  jobs[i].start();
}
