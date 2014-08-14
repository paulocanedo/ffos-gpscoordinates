// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic']);

app.controller('CoordinateCtrl', function ($scope, $http, $filter, $ionicPlatform) {
    var ellipsoid = new Ellipsoid(DATUM_SIRGAS);
    var started = false;
    var watchId = -1;

    function selectEllipsoid(_datum) {
        // $("#datumField").html(content);
    }

    var initiate_geolocation = function() {  
        if(!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        if(!started) {
            watchId = navigator.geolocation.watchPosition(
                            handle_geolocation_query,
                            handle_error,
                            { enableHighAccuracy: true, timeout: 60000 }
                        );

            started = true;
        }
    };

    function handle_geolocation_query(position){ 
        selectEllipsoid(ellipsoid);
        
        var latitude = new Latitude(position.coords.latitude);
        var longitude = new Longitude(position.coords.longitude); 
        var geographicCoord = new GeographicCoordinate(ellipsoid, latitude, longitude);
        var utmCoord = geographicCoord.toUTM();

        document.getElementById("detail-content").style.display = "";
        document.getElementById("message-content").style.display = "none";

        document.getElementById("latitudeField").innerHTML        = latitude.toString();
        document.getElementById("longitudeField").innerHTML       = longitude.toString();
        document.getElementById("centralMeridianField").innerHTML = longitude.getCentralMeridian().toMeridianCentralString();
        document.getElementById("eastField").innerHTML            = utmCoord.getEast().toFixed(3).toString() + "m";
        document.getElementById("northField").innerHTML           = utmCoord.getNorth().toFixed(3).toString() + "m";
        document.getElementById("zoneField").innerHTML            = utmCoord.getZone().toString();
        document.getElementById("altitudeField").innerHTML        = position.coords.altitude === undefined ? "NA" : position.coords.altitude.toFixed(0).toString() + "m";
        document.getElementById("accuracyField").innerHTML        = position.coords.accuracy.toFixed(0).toString() + "m";
        document.getElementById("timeField").innerHTML            = new Date(position.timestamp).toTimeString();

        navigator.mozTime.set(position.timestamp);
        navigator.mozTime.set(new Date(position.timestamp));
    }

    function handle_error(error) {
        var message = "";
        switch(error.code) {
            case error.PERMISSION_DENIED:
              message="You have to allow permission for Geolocation.";
              break;
            case error.POSITION_UNAVAILABLE:
              message="Location information is unavailable.";
              break;
            case error.TIMEOUT:
              message="The request to get user location timed out.";
              break;
            case error.UNKNOWN_ERROR:
              message="An unknown error occurred.";
              break;
        }
        var messageDom = document.getElementById('message-content');
        messageDom.innerHTML = message;
        var button = document.createElement('button');
        button.appendChild(document.createTextNode('Retry'));
        button.className = 'button button-full button-assertive';
        button.addEventListener('onclick', function() {
            messageDom.innerHTML = "Trying to get current location.";
            initiate_geolocation();
        });
        messageDom.appendChild(button);
    }


    initiate_geolocation();
    document.addEventListener("visibilitychange", function() {
        if(document.visibilityState === 'hidden') {
            navigator.geolocation.clearWatch(watchId);
            started = false;
        } else if(document.visibilityState === 'visible') {
            initiate_geolocation();
        }
    });
});

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});
