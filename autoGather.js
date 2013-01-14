var tcp = require("easyTCP");
tcp.add("private", "status", false);
tcp.add("public", "what", function(data, socket){
	if(data=="status"){
		if(private.status){
			socket.writeln("autoGather is running");
		}
		else{
			socket.writeln("autoGather is pending");
		}
	}
	else{
		socket.writeln("what [status]");
	}
});



tcp.start();

/*
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
*/