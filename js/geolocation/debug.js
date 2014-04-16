function log(msg) {
	console.log(msg);
}
function logs(msg) {
	if(!msg) {
		console.log(msg);
	} else {
		console.log(msg.toString());
	}
}

function test() {
	ellipsoid = new Ellipsoid(DATUM_SIRGAS);
	latitude = new Latitude(dms2dd(10, 10, 50.02315, false));
	longitude = new Longitude(dms2dd(48, 20, 17.32498));

	gcoord = new GeographicCoordinate(ellipsoid, latitude, longitude);
	tucoord = gcoord.toUTM();
	logs(tucoord);

	ucoord = new UTMCoordinate(ellipsoid, 22, Hemisphere_SOUTH, 791663.809, 8873425.688);
	tgcoord = ucoord.toGeodesic();
	logs("___________________________________________________________");
	logs(tgcoord);
}