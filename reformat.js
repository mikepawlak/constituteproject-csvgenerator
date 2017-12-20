//DEPENDENCIES
//-------------
var fs = require("fs");

//text manipulation and data modeling
var tm = require('text-miner');
//read/write variables, optionally passed in as args or config file (one day)
var readPath = "./output/output.json";
var writePath = __dirname + "/output/constIntxtFormat/";


function isNumber (n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function createFile(filename) {
  fs.open(filename,'r',function(err, fd){
    if (err) {
      fs.writeFile(filename, '', function(err) {
          if(err) {
              console.log(err);
          } else {
            console.log("The file was saved!");
          }
      });
    } else {
      console.log("The file exists!");
    }
  });
}


(function main() {
  fs.readFile(readPath, 'utf8', function (err, body) {
    if (err) {
      console.log(err);
    } else {
      var json = JSON.parse(body);

      json.map(function(v, i) {
        var break_index;
        var title;
        for (var j = 0; j < v.title.length; j++) {
          if (isNumber(v.title[j])) {
            break_index = j;
            title = v.title.substring(0, break_index).trim().replace(/ /g,"_");
            break;
          }
        }
        //createFile(writePath + title + ".txt");

        localWritePath = writePath + title + ".txt";
  			fs.writeFile(localWritePath, v.body, {flag: 'wx'}, function(err) {
  				if (err) {
  					console.log(" Error in saving to " + localWritePath + ":");
  					console.log(err);
  				}
  			 else {
  					console.log(" Document saved to " + writePath);
  				}
  			});

      });


    }
  });
})();
