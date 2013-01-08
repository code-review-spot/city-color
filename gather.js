//REQUIRED MODULES
var csv = require("ya-csv");
var config = require("./config.js");
var Instagram = require('instagram-node-lib');
var http = require('http');
var fs = require('fs');
var gd = require('gd');
var easyimg = require('easyimage');


//CITY DATA
var washington = {};
washington.csvPath = "./data/washington/data.csv";
washington.imagesPath = "./data/washington/images/";
washington.name = "Washington";
washington.locations = [];
washington.locations[0] = {};
washington.locations[0].lat = "38.895111";
washington.locations[0].long = "-77.036667";
washington.locations[0].distance = "5000"; //meters
Instagram.set('client_id',  config.instagram_client_id);


module.exports.run = function(){
	getData(washington, 0, onResults);
}


function getData(city, loc){
	var options = 
			{ 
				lat: city.locations[loc].lat,
				lng: city.locations[loc].long,
				distance: washington.locations[loc].distance,
				complete: function(data){
					var output = {};
					output.csvPath = city.csvPath;
					output.imagesPath = city.imagesPath;
					output.city = city.name;
					output.location = city.locations[loc];
					output.data = data;
				   	onResults(output);
				}
			};

	Instagram.media.search(options);
}

function onResults(data){
	for(var i=0; i<data.data.length; i++){
		var newImage = {};

		newImage.csvPath = data.csvPath;
		newImage.imagesPath = data.imagesPath;
		newImage.city = data.city;
		
		newImage.tags = data.data[i].tags;
		newImage.imageUrl = data.data[i].images.low_resolution.url;
		newImage.id = data.data[i].id;
		newImage.username = data.data[i].user.username;
		newImage.userId = data.data[i].user.id;
		newImage.caption = ""; 
		if(data.data[i].caption != null){
			newImage.caption = data.data[i].caption.text;
		}
		
		
		getImage(newImage);
	}
}

function getImage(data){
	
	var imgHost = "";
	var imgPath = "";
	var imgType = "jpg";

	data.imageUrl = data.imageUrl.replace("https://", "");
	data.imageUrl = data.imageUrl.replace("http://", "");

	var slashSpot = data.imageUrl.indexOf("/");

	imgHost = data.imageUrl.substring(0, slashSpot);
	imgPath = data.imageUrl.replace(imgHost, "");

	var dotSpot = imgPath.indexOf(".");
	imgType = imgPath.substring(dotSpot+1);

	data.savePath = data.imagesPath+data.id+"."+imgType
	data.pngPath = data.imagesPath+data.id+".png";

	options = {};
	options.host = imgHost;
	options.path = imgPath;
	options.port = 80;

	var request = http.get(options, function(res){
	    var imagedata = ''
	    res.setEncoding('binary')

	    res.on('data', function(chunk){
	        imagedata += chunk
	    })

	    res.on('end', function(){
	        fs.writeFile(data.savePath, imagedata, 'binary', function(err){
	            if (err) throw err
	            getRGB(data);
	        })
	    })

	});
}

function getRGB(data){
	easyimg.convert({src:data.savePath, dst:data.pngPath, quality:10}, function(err, image) {

		gd.openPng(
			data.pngPath,
			function(png, path) {
				if(png) {

					var R = 0;
					var G = 0;
					var B = 0;
					var C = 0;

					for(var x=0; x<306; x++){
						for(var y=0; y<306; y++){
							var pixel = png.getPixel(153,153);
							R+= (pixel >>> 16) & 0xFF;
							G+= (pixel >>> 8) & 0xFF;
							B+= pixel & 0xFF;
							C++;
						}
					}

					data.colors = {};
					data.colors.R = R/C;
					data.colors.G = G/C;
					data.colors.B = B/C;

					addRow(data);
					
				}
			}
		);
	});
}

function addRow(data){
	var w = csv.createCsvFileWriter(data.csvPath, {'flags': 'a'});

	var row = []
	row[0]=data.id;
	row[1]=data.city;
	row[2]=data.username;
	row[3]=data.userId;
	row[4]=data.colors.R;
	row[5]=data.colors.G;
	row[6]=data.colors.B;
	row[7]=""; //tags
	row[8]=data.caption;

	w.writeRecord(row);
}