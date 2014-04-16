function GeographicCoordinate(_ellipsoid, _latitude, _longitude, _height) {

    var ellipsoid;
    var latitude;
    var longitude;
    var height;
    var transverseMercator;

    ellipsoid = _ellipsoid;
    latitude = _latitude;
    longitude = _longitude;
    height = (_height == undefined) ? 0.0 : _height;

    this.getEllipsoid = function() {
        return ellipsoid;
    }

    this.getLatitude = function() {
        return latitude;
    }

    this.getLongitude = function() {
        return longitude;
    }

    this.getEllipsoidalHeight = function() {
        return height;
    }

    addMethod(this, "toUTM", function() {
        return this.getTransverseMercator().convertoToUTM(this, this.getLongitude().getCentralMeridian().toDegreeDecimal());
    });
    
    addMethod(this, "toUTM", function(zone) {
        return this.getTransverseMercator().convertoToUTM(this, Longitude.calcCentralMeridian(zone));
    });

    this.getMeridianConvergence = function() {
        return getTransverseMercator().convergenceFromGeographic(this);
    }

    this.getScaleCorrection = function() {
        return getTransverseMercator().scaleCorrection(this);
    }

    this.getTransverseMercator = function() {
        if (ellipsoid == null) {
            throw("Não é possível realizar a conversão porque esta coordenada não possui um datum definido.");
        }
        if (this.transverseMercator == undefined) {
            this.transverseMercator = new TransverseMercator(longitude.getCentralMeridian(), ellipsoid);
        }
        return this.transverseMercator;
    }

    this.toString = function() {
        return this.getLatitude() + ' , ' + this.getLongitude();
    }
}
