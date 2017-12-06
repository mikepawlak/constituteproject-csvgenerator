//DEPENDENCIES
//-------------
var req = require("request");
var fs = require("fs");
//for reading html, emulate DOM nodes
var cheerio = require("cheerio");
//for JSON -> CSV
var jsonexport = require('jsonexport');
//for output prettyness
var progress = require('cli-progress');
var bar = new progress.Bar({}, progress.Presets.shades_classic);

//CONFIG
//--------------
//read/write variables, optionally passed in as args or config file (one day)
var writePath = "./output/output";
var readPath = "./input/input.txt";

//GLOBLAL VARIABLES
//---------------
//these will be in an array of all countries observed
var countryArray = [];
//array to contain created objects for csv
var objArray = [];
//read failures, for exiting gracefully if a country is not read
var errorArray = [];


//FUNCTIONS
//---------------

//getConstText(obj)
/* gets full text string for a country id from constitute.org
takes in constitution id and writes to file set in config */
function createConstText(country) {
	//make call to get constitute ID
	var id_url = "https://www.constituteproject.org/service/constitutions?country=" + country;
	req.get(id_url, function(err, res, body) {
		if (err) {
			console.log("Error in generation...");
			errorArray.push({call: "getCountryID with " + country, error: err});
			objArray.push({});
			bar.update(objArray.length);
		} else {
			countryObj = JSON.parse(body)[0];
			if (countryObj !== undefined) {
				var url = "https://www.constituteproject.org/service/html?cons_id=" + countryObj.id + "&lang=en";
				//make call to constitute API, get constitution, full
				req.get(url, function(err, res, body) {
					if (err) {
						errorArray.push({call: "getConstituition", error: err});
						objArray.push({});
						bar.update(objArray.length);
					} else {
						var sanatized = JSON.parse(body).html;
						//I don't have access to the CountryObj since I can't pass it as an argument and all this promise-y stuff
						//means the stored variable will likely be behind so I need to build it back up from the html that's returned
					 var $ = cheerio.load(sanatized);
					 var title = $('h1').text();

						//create text from html
						sanatized = sanatized.replace(/<(?:.|\n)*?>/gm, '');
						//remove tabs and multicharacter spaces
						sanatized = sanatized.replace(/\s\s+/g, ' ');
						//remove punctuation
						sanatized = sanatized.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,'');
						objArray.push({
							title: title,
							body: sanatized
						});
						if (objArray.length == countryArray.length) {
							bar.update(countryArray.length);
							bar.stop();
							console.log(" ");
							if (errorArray.length === 0) {
								console.log(" Generation complete, saving to  document...");
							} else {
								console.log("Generation error... \n");
								for (var i = 0; i < errorArray.length; i++) {
									console.log(errorArray[i]);
								}
							}
							generateCSV(objArray);
						} else {
							bar.update(objArray.length);

						}

					}
				});
			} else {
				errorArray.push({call: "getConstitution", error: country + " not found."});
				objArray.push({});
				bar.update(objArray.length);
			}
		}
	});

}

//generateCSV(json)
//turns JSON into csv data and writes to file
function generateCSV(content) {
	//output JSON for analysis
	var localWritePath = writePath + ".json";
	fs.writeFile(localWritePath, json, function(err) {
		console.log("JSON file created...");
	});
	//JSON to CSV
	jsonexport(content,function(err, csv){
    if(err) {
			console.log(" Error in generating csv");
			console.log(err);
			process.exit();
		} else {
			//write to file and create CSV
			//write created object to file for analyzing
			localWritePath = writePath + ".csv";
			fs.writeFile(localWritePath, csv, function(err) {
				if (err) {
					console.log(" Error in saving to " + writePath + ":");
					console.log(err);
					process.exit();
				}
				else if (errorArray.length !== 0) {
					console.log("Error in generation, please check the input file and try again");
					process.exit();
				} else {
					console.log(" Document saved to " + writePath);
					process.exit();
				}
			});
		}

});
}

//MAIN
//--------------
(function main() {
	//read import file
	fs.readFile(readPath, 'utf8', function (err, body) {
		if (err) {
			console.log("Error reading file:");
			console.log(err);
			process.exit();
		} else {
			countryArray = JSON.parse(body);
			console.log(" Beginning CSV creation...");
			bar.start(countryArray.length, 0);
			for (var i = 0; i < countryArray.length; i++) {
				createConstText(countryArray[i]);
			}
		}
	});
})();
