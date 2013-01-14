var oe = require('optimal-events');

//REQUIRED MODULES
oe.setData("csv", require("ya-csv"));
oe.setData("config", require("./config.js"));
oe.setData("Instagram", require('instagram-node-lib'));
oe.setData("http", require('http'));
oe.setData("fs", require('fs'));
oe.setData("gd", require('gd'));
oe.setData("easyimg", require('easyimage'));

var cities = {};
//CITY DATA
cities.washington = {};
cities.washington.name = "washington";
cities.washington.lat = "38.895111";
cities.washington.long = "-77.036667";

cities.

oe.setData("cities", cities);


Instagram.set('client_id',  config.instagram_client_id);


module.exports.run = function(){
	getData(cities.washington, 0, onResults);
}


oe.setData("getCity", function(city){
	var options = { 
		lat: city.lat,
		lng: city.long,
		distance: 5000,
		complete: function(data){
			var output = {};
			output.csvPath = csvPath(city.name);
			output.imagesPath = imagesPath(city.name);
			output.city = city.name;
			output.location = city.locations[loc];
			output.data = data;
		   	public.onResults(output);
		}
	};

	Instagram.media.search(options);
});

oe.setData("onResults", function(data){
	for(var i=0; i<data.data.length; i++){
		var newImage = {};

		newImage.csvPath = data.csvPath;
		newImage.imagesPath = data.imagesPath;
		newImage.city = data.city;
		
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
});

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