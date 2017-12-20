//DEPENDENCIES
//-------------
var fs = require("fs");

//text manipulation and data modeling
var tm = require('text-miner');
//read/write variables, optionally passed in as args or config file (one day)
var readPath = "./output/output.json";
var writePath = "./analyze/output.txt";

//check stopwords to make sure none of the topic terms are in them
/*
tm.STOPWORDS.EN.map(function(v, i) {
  console.log(v);
});
*/



(function main() {
  fs.readFile(readPath, 'utf8', function (err, body) {
    if (err) {
      console.log(err);
    } else {
      var json = JSON.parse(body);
      var test = [];

      json.map(function(v, i) {
        test.push(v.body);
      });

      var corp = new tm.Corpus(test);

      corp
          .trim()
          .toLower()
          .clean()
          .removeInterpunctuation()
          .removeNewlines();

      console.log(Object.keys(corp)); 
      //var matrix = tm.TermDocumentMatrix(corp);
    }
  });
})();
