var csv = require("ya-csv");
var http = require("http");


var config = require("./config.js");

var washington = {};
washington.csv = "./data/washington/data.csv";
washington.images = "./data/washington/images/";
washington.locations = [];
washington.locations[0] = {};
washington.locations[0].lat = "38.895111";
washington.locations[0].long = "-77.036667";
washington.locations[0].distance = "5000"; //meters

console.log(washington);

var w = csv.createCsvFileWriter(washington.csv, {'flags': 'a'});
//w.writeRecord(["test"]);

var curlData = {};
curlData.host = "api.instagram.com";
curlData.port = 443;
curlData.path = "/v1/media/search?client_id="+config.instagram_id+"&lat="+washington.locations[0].lat+"&lng="+washington.locations[0].long+"&distance="+washington.locations[0].distance;
curlData.method = "GET";

console.log(curlData);

var req = http.request(curlData)
.on('error', function(err){
	console.log(err);
})
.on('end', function(res){
	console.log(res);
});

