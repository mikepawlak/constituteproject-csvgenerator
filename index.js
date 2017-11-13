//dependencies
var req = require("request");
var fs = require("fs");
var cheerio = require("cheerio");
var jsonexport = require('jsonexport');
//for output prettyness
var progress = require('cli-progress');
var bar = new progress.Bar({}, progress.Presets.shades_classic);

//config variables, optionally passed in config file (one day)
var writePath = "./output/output";
var readPath = "./input/input.txt";


//these will be in an array of all countries observed
var countryArray = [];
//array to contain created objects for csv
var objArray = [];
//read failures, for exiting gracefully if a country is not read
var errors = 0;
var errorArray = [];



//getConstText(obj)
/* gets full text string for a country id from constitute.org
takes in constitution id and writes to file set in config */
function createConstText(country) {
	//make call to get constitute ID
	var id_url = "https://www.constituteproject.org/service/constitutions?country=" + country;
	req.get(id_url, function(err, res, body) {
		if (err) {
			console.log("Error in generation...");
			errors += 1;
			errorArray.push(country);
			objArray.push({});
			bar.update(objArray.length);
		} else {
			countryObj = JSON.parse(body)[0];
			if (countryObj !== undefined) {
				var url = "https://www.constituteproject.org/service/html?cons_id=" + countryObj.id + "&lang=en";
				//make call to constitute API, get constitution, full
				req.get(url, function(err, res, body) {
					if (err) {
						errors += 1;
						errorArray.push(err);
						objArray.push({});
						bar.update(objArray.length);
					} else {


						var sanatized = JSON.parse(body).html;


						//I don't have access to the CountryObj since I can't pass it as an argument and all this promise-y stuff
						//means the stored variable will likely be behind so I need to build it back up from the html that's returned
					 var $ = cheerio.load(sanatized);
					 var title = $('h1').text();

						//remove tabs and multicharacter spaces
						sanatized = sanatized.replace(/\s\s+/g, ' ');
						//create text from html (this was totally stolen from SO https://stackoverflow.com/questions/822452/strip-html-from-text-javascript)
						sanatized = sanatized.replace(/<(?:.|\n)*?>/gm, '');
						objArray.push({
							title: title,
							body: sanatized
						});
						if (objArray.length == countryArray.length) {
							bar.update(countryArray.length);
							bar.stop();
							console.log(" ");
							if (errors === 0) {
								console.log(" Generation complete, saving to  document...");
							} else {
								console.log("Generation error...");
							}
							generateCSV(objArray);
						} else {
							bar.update(objArray.length);

						}

					}
				});
			} else {
				errors += 1;
				errorArray.push(err);
				objArray.push({});
				bar.update(objArray.length);
			}
		}
	});

}



//write to csv file(array)
//turns JSON into csv data and writes to file
function generateCSV(content) {
	//JSON to CSV
	jsonexport(content,function(err, csv){
    if(err) {
			console.log(" Error in generating csv");
			console.log(err);
			process.exit();
		} else {
			//write to file and create CSV
			//write created object to file for analyzing
			var localWritePath = writePath + ".csv";
			fs.writeFile(localWritePath, csv, function(err) {
				if (err) {
					console.log(" Error in saving to " + writePath + ":");
					console.log(err);
					process.exit();
				}
				else if (errors !== 0) {
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


function main() {
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
}



main();
