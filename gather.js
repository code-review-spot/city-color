var config = require("./config.js");

var washington = {};
washington.csv = "./data/washington/data.csv";
washington.images = "./data/washington/images/";
washington.locations = [];
washington.locations[0] = {};
washington.locations[0].lat = "";
washington.locations[0].long = "";
washington.locations[0].distance = "";

var csv = require("ya-csv");

var w = csv.createCsvFileWriter(washington.csv, {'flags': 'a'});

console.log(config);

w.writeRecord(["test"]);