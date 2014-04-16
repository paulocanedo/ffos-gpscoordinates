/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

var ellipsoid = new Ellipsoid(DATUM_SIRGAS);
var started = false;
var watchId = -1;

function selectEllipsoid(_datum) {
    // $("#datumField").html(content);
}

function initiate_geolocation() {  
    if(!navigator.geolocation) {
        alert("Geolocation not supported");
        return;
    }

    if(!started) {
        watchId = navigator.geolocation.watchPosition(handle_geolocation_query, showError);
        started = true;
    }
}  

function handle_geolocation_query(position){  
    selectEllipsoid(ellipsoid);
    
    var latitude = new Latitude(position.coords.latitude);
    var longitude = new Longitude(position.coords.longitude); 
    var geographicCoord = new GeographicCoordinate(ellipsoid, latitude, longitude);
    var utmCoord = geographicCoord.toUTM();

    document.getElementById("latitudeField").innerHTML        = latitude.toString();
    document.getElementById("longitudeField").innerHTML       = longitude.toString();
    document.getElementById("centralMeridianField").innerHTML = longitude.getCentralMeridian().toMeridianCentralString();
    document.getElementById("eastField").innerHTML            = utmCoord.getEast().toFixed(3).toString() + "m";
    document.getElementById("northField").innerHTML           = utmCoord.getNorth().toFixed(3).toString() + "m";
    document.getElementById("zoneField").innerHTML            = utmCoord.getZone().toString();
    document.getElementById("altitudeField").innerHTML        = position.coords.altitude == undefined ? "NA" : position.coords.altitude.toFixed(0).toString();
    document.getElementById("haccuracyField").innerHTML       = position.coords.accuracy.toFixed(0).toString();
    document.getElementById("vaccuracyField").innerHTML       = position.coords.altitudeAccuracy == undefined ? "NA" : position.coords.altitudeAccuracy.toFixed(0).toString();
}

function showError(error) {
    var message = ""
    switch(error.code) {
        case error.PERMISSION_DENIED:
          message="You have to allow permission for Geolocation."
          break;
        case error.POSITION_UNAVAILABLE:
          message="Location information is unavailable."
          break;
        case error.TIMEOUT:
          message="The request to get user location timed out."
          break;
        case error.UNKNOWN_ERROR:
          message="An unknown error occurred."
          break;
    }
    alert(message);
}

initiate_geolocation();