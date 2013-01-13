function newSpot(lat1, lon1, brng, d){
	var R = 6371; // km
	lat1 = lat1 * (Math.PI/180);
	lon1 = lon1 * (Math.PI/180);
	brng = brng * (Math.PI/180);
	var lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) + Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng) );
	var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1), Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));

	lat2 = lat2/(Math.PI/180);
	lon2 = lon2/(Math.PI/180);

	console.log(lat2+", "+lon2);
}