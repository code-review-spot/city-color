var oe = require('optimal-events');
var config = require("./config.js");

var cities = {};
//CITY DATA
cities.boston ={};
cities.boston.city = "boston";
cities.boston.lat = "42.332";
cities.boston.long = "71.02";

cities.washington ={};
cities.washington.city = "washington";
cities.washington.lat = "38.9041";
cities.washington.long = "77.017";

cities.baltimore ={};
cities.baltimore.city = "baltimore";
cities.baltimore.lat = "39.3002";
cities.baltimore.long = "76.61";

cities.seattle ={};
cities.seattle.city = "seattle";
cities.seattle.lat = "47.6205";
cities.seattle.long = "22.35";

cities.philadelphia ={};
cities.philadelphia.city = "philadelphia";
cities.philadelphia.lat = "40.0094";
cities.philadelphia.long = "75.133";

cities.detroit ={};
cities.detroit.city = "detroit";
cities.detroit.lat = "42.383";
cities.detroit.long = "83.102";

cities.san_jose ={};
cities.san_jose.city = "san_jose";
cities.san_jose.lat = "37.969";
cities.san_jose.long = "21.819";

cities.columbus ={};
cities.columbus.city = "columbus";
cities.columbus.lat = "39.9848";
cities.columbus.long = "82.985";

cities.chicago ={};
cities.chicago.city = "chicago";
cities.chicago.lat = "41.8376";
cities.chicago.long = "87.681";

cities.charlotte ={};
cities.charlotte.city = "charlotte";
cities.charlotte.lat = "35.2087";
cities.charlotte.long = "80.83";

cities.new_york ={};
cities.new_york.city = "new_york";
cities.new_york.lat = "40.6643";
cities.new_york.long = "73.938";

cities.memphis ={};
cities.memphis.city = "memphis";
cities.memphis.lat = "35.1035";
cities.memphis.long = "89.978";

cities.san_diego ={};
cities.san_diego.city = "san_diego";
cities.san_diego.lat = "32.8153";
cities.san_diego.long = "17.135";

cities.dallas ={};
cities.dallas.city = "dallas";
cities.dallas.lat = "32.7942";
cities.dallas.long = "96.765";

cities.indianapolis ={};
cities.indianapolis.city = "indianapolis";
cities.indianapolis.lat = "39.7767";
cities.indianapolis.long = "86.145";

cities.san_antonio ={};
cities.san_antonio.city = "san_antonio";
cities.san_antonio.lat = "29.4724";
cities.san_antonio.long = "98.525";

cities.los_angeles ={};
cities.los_angeles.city = "los_angeles";
cities.los_angeles.lat = "34.0194";
cities.los_angeles.long = "18.41";

cities.phoenix ={};
cities.phoenix.city = "phoenix";
cities.phoenix.lat = "33.5722";
cities.phoenix.long = "12.088";

cities.houston ={};
cities.houston.city = "houston";
cities.houston.lat = "29.7805";
cities.houston.long = "95.386";

cities.jacksonville ={};
cities.jacksonville.city = "jacksonville";
cities.jacksonville.lat = "30.337";
cities.jacksonville.long = "81.661";

//ADD REQUIRED MODULES TO OPTIMAL EVENT
oe.require("csv", "ya-csv");
oe.require("http", 'http');
oe.require("fs", 'fs');
oe.require("gd", 'gd');
oe.require("easyimg", 'easyimage');
oe.require("Instagram", 'instagram-node-lib');
oe.setData("config", config);

//holder for all image ids in a city
oe.setData("images", {});

oe.setData("msg", "testing 123");

module.exports.start = function(){

	var args = cities.washington;
	args.time = 300000;
	oe.start(args);
}

module.exports.stop = function(){
	oe.stop();
}

module.exports.get = function(field){
	return oe.getData(field);
}

module.exports.load = function(){
	oe.call("load");
}

oe.setAct(function(args){
	oe.call("getCity", args);
	console.log("ACT");
});



oe.setAssess(function(args){
	var ideal = 15;
	var found = args.end_num - args.start_num;

	var divider = (100/15)*found;
	args.time = args.time/divider;
	public.schedule(args);
});

oe.setSchedule(function(args){
	console.log("City: "+args.city+" | Time: "+args.time);
	if(public.running){
		setTimeout(function(){public.act(args);}, args.time);
	}
});

//CHECKS IF A CITY HAS AN IMAGE YET
oe.setData("newImage", function(city, id){
	var imgs = public.images[city];
	if(typeof imgs == "undefined"){
		imgs = {};
		public.images[city] = {};
	}
	var slen = imgs.length;

	if(typeof imgs[id] == "undefined"){
		imgs[id] = "locked";
		if(public.images[city].length!=slen){
			console.log("LOSS OF DATA");
		}
		public.images[city] = imgs;
		return true;
	}
	else{
		return false;
	}

});

//RETURN THE NUMBER OF IMAGES FOR A CITY
oe.setData("numberImages", function(city){
	var imgs = public.images[city];
	if(typeof imgs == "undefined"){
		imgs = {};
		public.images[city] = {};
	}
	var slen = imgs.length;
	return slen;
});

//STARTS THE GATHER AND COUNT PROCESS
oe.setData("getCity", function(args){
	var options = {
		lat: args.lat,
		lng: args.long,
		distance: 5000,
		complete: function(data){
			var output = {};
			output.csvPath = "./data/"+args.city+"/data.csv";
			output.imagesPath = "./data/"+args.city+"/images/";
			output.city = args.city;
			output.data = data;
		   	public.onResults(output);
		}
	};

	public.Instagram.media.search(options);
});

//PROCESS THE DATA INSTAGRAM GIVES US
oe.setData("onResults", function(data){
	var args = {};
	args.city = data.city;

	args.start_num = public.numberImages(data.city);

	for(var i=0; i<data.data.length; i++){
		if(public.newImages(data.city, data.data[i].id)){
			var newImage = {};

			newImage.csvPath = data.csvPath;
			newImage.imagesPath = data.imagesPath;
			newImage.city = data.city;
			
			newImage.imageUrl = data.data[i].images.low_resolution.url;
			newImage.id = data.data[i].id;
			newImage.username = data.data[i].user.username;
			newImage.userId = data.data[i].user.id;
			
			public.getImage(newImage);
		}
	}

	args.end_num = public.numberImages(data.city);

	//START THE NEXT CALL
	public.assess(args);
});

//DOWNLOAD THE IMAGE FROM INSTAGRAMS SITE
oe.setData("getImage", function(data){
	
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

	var request = public.http.get(options, function(res){
	    var imagedata = ''
	    res.setEncoding('binary')

	    res.on('data', function(chunk){
	        imagedata += chunk
	    })

	    res.on('end', function(){
	        public.fs.writeFile(data.savePath, imagedata, 'binary', function(err){
	            if (err){
	            	console.log("Error: "+data.imageUrl);
	            }
	            else{
	            	public.getRGB(data);
	            }
	        })
	    })

	});
});

//CONVERT THE JPG TO A PNG, DELETE THE JPG, GET THE RGB FROM THE PNG
oe.setData("getRGB", function(data){
	public.easyimg.convert({src:data.savePath, dst:data.pngPath, quality:10}, function(err, image) {
		public.fs.unlink(data.savePath, function(err){
			console.log("DELETING FILE ERROR: "+err);
		});
		public.gd.openPng(
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
});

//SAVE THE DATA
oe.setData("addRow", function(data){
	var w = public.csv.createCsvFileWriter(data.csvPath, {'flags': 'a'});

	var row = []
	row[0]=data.id;
	row[1]=data.city;
	row[2]=data.username;
	row[3]=data.userId;
	row[4]=data.colors.R;
	row[5]=data.colors.G;
	row[6]=data.colors.B;

	w.writeRecord(row);
});