var ellipsoid = new Ellipsoid(DATUM_SIRGAS);
var started = false;
var watchId = -1;

function selectEllipsoid(_datum) {
    content = _datum == DATUM_SIRGAS ? "SIRGAS2000" : "WGS84";
    content = content + " <span class='caret'></span>";
    
    $("#datumField").html(content);
}

function initiate_geolocation() {  
    if(!started) {
        watchId = navigator.geolocation.watchPosition(handle_geolocation_query);
        started = true;
        $("#controlGpsLabel").html("Stop Watch Location");
        $("#controlGpsLabel").removeClass('btn-primary');
        $("#controlGpsLabel").addClass('btn-danger');
    } else {
        $("#controlGpsLabel").html("Start Watch Location");
        $("#controlGpsLabel").addClass('btn-primary');
        $("#controlGpsLabel").removeClass('btn-danger');
        navigator.geolocation.clearWatch(watchId);
        started = false;
        watchId = -1;
    }
}  

function handle_geolocation_query(position){  
    selectEllipsoid(ellipsoid);
    
    latitude = new Latitude(position.coords.latitude);
    longitude = new Longitude(position.coords.longitude); 
    geographicCoord = new GeographicCoordinate(ellipsoid, latitude, longitude);
    utmCoord = geographicCoord.toUTM();
    
    $("#latitudeField").html(latitude.toString());
    $("#longitudeField").html(longitude.toString());
    $("#centralMeridianField").html(longitude.getCentralMeridian().toMeridianCentralString());
    $("#eastField").html(utmCoord.getEast().toFixed(3).toString());
    $("#northField").html(utmCoord.getNorth().toFixed(3).toString());
    $("#zoneField").html(utmCoord.getZone().toString());
    
    $("#altitudeField").html(position.coords.altitude == undefined ? "NA" : position.coords.altitude.toFixed(0).toString());    
    $("#haccuracyField").html(position.coords.accuracy.toFixed(0).toString());
    $("#vaccuracyField").html(position.coords.altitudeAccuracy == undefined ? "NA" : position.coords.altitudeAccuracy.toFixed(0).toString());
    
}
