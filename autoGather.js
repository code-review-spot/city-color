
var gather = require("./gather.js");

run(1, gather);


function run(i, gather){
	console.log("RUN #: "+i);
	gather.run();
	setTimeout(function(){
		i++;
		run(i,gather);
	}, 300000);
}