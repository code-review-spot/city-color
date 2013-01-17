var tcp = require("easyTCP");
var gatherPath = __dirname+"/gather";

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

tcp.add("public", "get", function(data, socket){
	var got = public.gather.get(data);
	socket.writeln(data+" --> "+got);
});

tcp.add("private", "gatherPath", gatherPath);

tcp.add("public", "start", function(data, socket){
	public.gather.start();
	private.status = true;
	public.what("status", socket);
});

tcp.add("public", "stop", function(data, socket){
	public.gather.stop();
	private.status = false;
	public.what("status", socket);
});

tcp.add("private", "confirmRunning", function(){
	public.gather = require(private.gatherPath);
	console.log("WE'RE RUNNING");
})

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