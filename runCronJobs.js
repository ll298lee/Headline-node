var fs = require('fs');

var job_files = fs.readdirSync('./app/cronJobs');
var jobs = [];
for(var i in job_files){
  var name = job_files[i].split('.')[0];
  jobs.push(require('./app/cronJobs/'+name));
}

for(var i in jobs){
  jobs[i].start();
}
