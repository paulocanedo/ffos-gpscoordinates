function UTMCoordinate(_ellipsoid, _zone, _hemisphere, _east, _north, _height) {

    var point2d = new Point2D(0.0, 0.0);

    var ellipsoid;
    var zone;
    var hemisphere;
    var height;
    var transverseMercator;

    ellipsoid = _ellipsoid;
    zone = _zone;
    hemisphere = _hemisphere;
    height = _height == undefined ? 0.0 : _height;
    point2d.location(_east, _north);
    
    this.toGeodesic = function() {
        return this.getTransverseMercator().convertToGeographic(this);
    }

    this.getTransverseMercator = function() {
        if (ellipsoid == null) {
            throw ("Não é possível realizar a conversão porque esta coordenada não possui um datum definido.");
        }
        if (this.transverseMercator == null) {
            var centralMeridian = new Longitude(calcCentralMeridian(zone));
            this.transverseMercator = new TransverseMercator(centralMeridian, ellipsoid);
        }
        return this.transverseMercator;
    }

    this.getZone = function() {
        return zone;
    }

    this.getHemisphere = function() {
        return hemisphere;
    }

    this.getEast = function() {
        return point2d.getX();
    }

    this.getNorth = function() {
        return point2d.getY();
    }

    this.setEllipsoidalHeight = function(_height) {
        height = _height;
    }

    this.getEllipsoidalHeight = function() {
        return height;
    }

    this.getEllipsoid = function() {
        return ellipsoid;
    }

    this.toString = function() {
        return "E: " + point2d.getX().toFixed(3) + ", N: " + point2d.getY().toFixed(3);
    }
    
}
