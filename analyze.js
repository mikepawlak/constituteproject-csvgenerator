var fs = require("fs");

//text manipulation and data modeling
var tm = require('text-miner');
//read/write variables, optionally passed in as args or config file (one day)
var readPath = "./output/output.json";
var writePath = "./analyze/output.txt";


fs.readFile(readPath, 'utf8', function (err, body) {
  if (err) {
    console.log(err);
  } else {
    console.log(JSON.parse(body));
  }
});
