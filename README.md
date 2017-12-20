# constituteproject-csvgenerator
This project is a generator that I created to assist with research as part of PoliSci446 and is not intended for public use.
***
The Constitute Project CSV Generator is a small project that creates a csv, JSON, or groups of txt files for conducting text based analysis of world constitutions. It draws on html versions of world constitutions found at [Constitute](https://www.constituteproject.org) using the public [api](https://docs.google.com/document/d/1wATS_IAcOpNZKzMrvO8SMmjCgOZfgH97gmPedVxpMfw/pub) and NodeJS.

# Getting Started

This project assumes you have already installed NodeJS which can be found [here](https://nodejs.org/en/), and Node Package Manager (NPM) which can be found [here](https://www.npmjs.com/get-npm).

To install the CSV Generator must either clone the Github repo or directly download it from [the project's main page](https://github.com/mikepawlak/constituteproject-csvgenerator).

To install with git run the following commands:

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `git clone https://github.com/mikepawlak/constituteproject-csvgenerator <folder for your project (optional>`

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `cd <folder for your project>`

To install all dependencies for the project, ensure you have navigated to the root directory of the project and run `npm install`

# Pulling Down Data

The CSV Generator pulls in constitution data from [Constitute](https://www.constituteproject.org) by the constitution's `id` as a javascript array in the following format:

`["Morocco","Namibia","Nepal","Netherlands_the","New_Zealand"]`

While most Constitute ids are simply the name of the country. Some are harder to guess than other, be sure to review [Constitute](https://www.constituteproject.org) to ensure proper formatting.

The array can be loaded into the program under the "input" folder.

--/root

----/input

-------*file.txt goes here*

----/output

# Generating Data

To run the generator, simply run the comand `npm run generate`

The output will be created in the "output" folder as a csv, JSON, and group of txt files.

--/root

----/input

----/output

--------/textfiles

 ----------------Morocco.txt

 ----------------Namibia.txt

 ----------------Nepal.txt

 ----------------Netherlands_the.txt

--------*output.json*

--------*output.csv*

The csv file is in the format below, the titles are grabbed from the title in the html of the html version of each constitution -

Index | Title | Data
--- | --- | ---


# Analyzing Data **DEPRECATED**

**NOTE** *this command bas been replaced with an R script and is not currently functional

To analyze the data simply run the command `npm run analyze`, using the [text-miner](https://github.com/Planeshifter/text-miner) library, it will run the data through some data preperation and the output a term frequency matrix.
