function TransverseMercator(_centralMeridian, _ellipsoid) {

    var deltaEasting = 40000000.0;
    var deltaNorthing = 40000000.0;
    var falseEasting = 500000.0;
    var falseNorthing = 10000000.0;
    var scaleFactor0 = 0.9996;
    var centralMeridian = new Longitude(0.0);
    var latitudeOfTrueScale = new Latitude(0.0);
    var ellipsoid;
    var sin1 = Math.sin(new AngleValue(dms2dd(0, 0, 1, true)).toRadians());
    
    centralMeridian = _centralMeridian;
    ellipsoid = _ellipsoid;

    this.convertoToUTM = function(_coordinate, _centralMeridian) {
        lon = _coordinate.getLongitude().toDegreeDecimal();
        latRad = _coordinate.getLatitude().toRadians();

        el2 = ellipsoid.getEl2();
        eta = el2 * Math.pow(Math.cos(latRad), 2);
        el4 = eta * eta;
        el6 = el4 * eta;
        el8 = el6 * eta;

        S = ellipsoid.calcS(latRad);
        nu = ellipsoid.calcNU(latRad);

        T1 = S * scaleFactor0;
        T2 = nu * Math.sin(latRad) * Math.cos(latRad) * scaleFactor0 / 2.0;
        T3 = nu * Math.sin(latRad) * Math.pow(Math.cos(latRad), 3) * scaleFactor0 / 24.0
                * (5 - Math.pow(Math.tan(latRad), 2) + 9 * el2 * Math.pow(Math.cos(latRad), 2) + 4 * el4 * Math.pow(Math.cos(latRad), 4));

        T4 = ((nu * Math.sin(latRad) * Math.pow(Math.cos(latRad), 5) * scaleFactor0) / 720.0)
                * (61 - 58 * Math.pow(Math.tan(latRad), 2) + Math.pow(Math.tan(latRad), 4) + 270 * el2 * Math.pow(Math.cos(latRad), 2) - 330 * Math.pow(Math.tan(latRad), 2) * el2 * Math.pow(Math.cos(latRad), 2)
                + 445 * el4 * Math.pow(Math.cos(latRad), 4) + 324 * el6 * Math.pow(Math.cos(latRad), 6) - 680 * Math.pow(Math.tan(latRad), 2) * el4 * Math.pow(Math.cos(latRad), 4)
                + 88 * el8 * Math.pow(Math.cos(latRad), 8) - 600 * Math.pow(Math.tan(latRad), 2) * el6 * Math.pow(Math.cos(latRad), 6) - 192 * Math.pow(Math.tan(latRad), 2) * el8 * Math.pow(Math.cos(latRad), 8));
        T6 = nu * Math.cos(latRad) * scaleFactor0;
        T7 = nu * Math.pow(Math.cos(latRad), 3) * scaleFactor0 / 6.0
                * (1 - Math.pow(Math.tan(latRad), 2) + el2 * Math.pow(Math.cos(latRad), 2));
        T8 = nu * Math.pow(Math.cos(latRad), 5) * scaleFactor0 / 120.0
                * (5 - 18 * Math.pow(Math.tan(latRad), 2) + Math.pow(Math.tan(latRad), 4) + 14 * el2 * Math.pow(Math.cos(latRad), 2) - 58 * Math.pow(Math.tan(latRad), 2) * el2 * Math.pow(Math.cos(latRad), 2) + 13 * el4 * Math.pow(Math.cos(latRad), 4)
                + 4 * el6 * Math.pow(Math.cos(latRad), 6) - 64 * Math.pow(Math.tan(latRad), 2) * el4 * Math.pow(Math.cos(latRad), 4) - 24 * Math.pow(Math.tan(latRad), 2) * el6 * Math.pow(Math.cos(latRad), 6));

        deltaLon = lon - _centralMeridian;

        deltaLonSeconds = deltaLon * 60 * 60;
        p = 0.0001 * Math.abs(deltaLonSeconds);

        f1 = T1;
        f2 = T2 * Math.pow(sin1, 2) * 1E8;
        f3 = T3 * Math.pow(sin1, 4) * 1E16;
        f4 = T6 * sin1 * 1E4;
        f5 = T7 * Math.pow(sin1, 3) * 1E12;

        A6 = (T4 * Math.pow(sin1, 6)) * 1E24;
        B5 = (T8 * Math.pow(sin1, 5)) * 1E20;

        utm_north = f1 + f2 * Math.pow(p, 2) + f3 * Math.pow(p, 4) + A6 * Math.pow(p, 6);
        if (latRad < 0) {
            utm_north = falseNorthing + utm_north;
        }

        deltaEast = (f4 * p + f5 * Math.pow(p, 3) + B5 * Math.pow(p, 5));
        utm_east = deltaLon > 0 ? (falseEasting + deltaEast) : (falseEasting - deltaEast);

        zone = _coordinate.getLongitude().getZone();
        hemisphere = _coordinate.getLatitude().getHemisphere();

        return new UTMCoordinate(ellipsoid, zone, hemisphere, utm_east, utm_north, _coordinate.getEllipsoidalHeight());
    }

    this.convertToGeographic = function(_coordinate) {
        northing = _coordinate.getNorth(), easting = _coordinate.getEast();
        if (_coordinate.getHemisphere() == Hemisphere_SOUTH) {
            northing = northing - falseNorthing;
        }

        lon0 = centralMeridian.toDegreeDecimal();
        phi1 = latitudeOfTrueScale.toRadians();

        tmdo = ellipsoid.calcS(phi1);
        tmd = tmdo + northing / scaleFactor0;
        phi1 = tmd / ellipsoid.calcRHO(phi1);
        t10 = 0, sr = 0;
        for (i = 0; i < 5; i++) {
            t10 = ellipsoid.calcS(phi1);
            sr = ellipsoid.calcRHO(phi1);
            phi1 = phi1 + (tmd - t10) / sr;
        }
        
        el2 = ellipsoid.getEl2();
        eta = el2 * Math.pow(Math.cos(phi1), 2.0);
        el4 = eta * eta;
        el6 = el4 * eta;
        el8 = el6 * eta;

        rho = ellipsoid.calcRHO(phi1);
        nu = ellipsoid.calcNU(phi1);

        T10 = Math.tan(phi1) / (2 * rho * nu * Math.pow(scaleFactor0, 2));
        T11 = Math.tan(phi1) / (24.0 * rho * Math.pow(nu, 3) * Math.pow(scaleFactor0, 4))
                * (5 + 3 * Math.pow(Math.tan(phi1), 2) + el2 * Math.pow(Math.cos(phi1), 2) - 4 * el4 * Math.pow(Math.cos(phi1), 4) - 9 * Math.pow(Math.tan(phi1), 2) * el2 * Math.pow(Math.cos(phi1), 2));
        T12 = Math.tan(phi1) / (720.0 * rho * Math.pow(nu, 5) * Math.pow(scaleFactor0, 6))
                * (61 + 90 * Math.pow(Math.tan(phi1), 2) + 46 * el2 * Math.pow(Math.cos(phi1), 2) + 45 * Math.pow(Math.tan(phi1), 4) - 252 * Math.pow(Math.tan(phi1), 2) * el2 * Math.pow(Math.cos(phi1), 2)
                - 3 * el4 * Math.pow(Math.cos(phi1), 4) + 100 * el6 * Math.pow(Math.cos(phi1), 6) - 66 * Math.pow(Math.tan(phi1), 2) * el4 * Math.pow(Math.cos(phi1), 4)
                - 90 * Math.pow(Math.tan(phi1), 4) * el2 * Math.pow(Math.cos(phi1), 2) + 88 * el8 * Math.pow(Math.cos(phi1), 8) + 225 * Math.pow(Math.tan(phi1), 4) * el4 * Math.pow(Math.cos(phi1), 4)
                + 84 * Math.pow(Math.tan(phi1), 2) * el6 * Math.pow(Math.cos(phi1), 6) - 192 * Math.pow(Math.tan(phi1), 2) * el8 * Math.pow(Math.cos(phi1), 8));
        T13 = Math.tan(phi1) / (40320.0 * rho * Math.pow(nu, 7) * Math.pow(scaleFactor0, 8))
                * (1385 + 3633 * Math.pow(Math.tan(phi1), 2) + 4095 * Math.pow(Math.tan(phi1), 4) + 1575 * Math.pow(Math.tan(phi1), 6));
        T14 = 1.0 / (nu * Math.cos(phi1) * scaleFactor0);
        T15 = (1.0 / (6 * Math.pow(nu, 3) * Math.cos(phi1) * Math.pow(scaleFactor0, 3)))
                * (1 + 2 * Math.pow(Math.tan(phi1), 2) + el2 * Math.pow(Math.cos(phi1), 2));
        T16 = 1.0 / (120 * Math.pow(nu, 5) * Math.cos(phi1) * Math.pow(scaleFactor0, 5))
                * (5 + 6 * el2 * Math.pow(Math.cos(phi1), 2) + 28 * Math.pow(Math.tan(phi1), 2) - 3 * el4 * Math.pow(Math.cos(phi1), 4) + 8 * Math.pow(Math.tan(phi1), 2) * el2 * Math.pow(Math.cos(phi1), 2)
                + 24 * Math.pow(Math.tan(phi1), 4) - 4 * el6 * Math.pow(Math.cos(phi1), 6) + 4 * Math.pow(Math.tan(phi1), 2) * el4 * Math.pow(Math.cos(phi1), 4) + 24 * Math.pow(Math.tan(phi1), 2) * el6 * Math.pow(Math.cos(phi1), 6));

        de = easting - falseEasting;

        if (Math.abs(de) < 0.0001) {
            de = 0.0;
        }
        q = 0.000001 * de;
        f9 = (T14 / sin1) * 1E6;
        f10 = (T15 / sin1) * 1E18;
        E5 = (T16 / sin1) * 1E30;

        lat = phi1 - Math.pow(de, 2.0) * T10 + Math.pow(de, 4.0) * T11 - Math.pow(de, 6.0) * T12
                + Math.pow(de, 8.0) * T13;
        dlon = f9 * q - f10 * Math.pow(q, 3) + E5 * Math.pow(q, 5);
        lon = lon0 + dlon / 3600;

        return new GeographicCoordinate(ellipsoid, new Latitude(Math.toDegrees(lat)), new Longitude(lon), _coordinate.getEllipsoidalHeight());
    }

    this.convergenceFromGeographic = function(_coordinate) {
        latRad = _coordinate.getLatitude().toRadians();
        lon = _coordinate.getLongitude().toDegreeDecimal();
        lon0 = _coordinate.getLongitude().getCentralMeridian().toDegreeDecimal();

        deltaLon = lon - lon0;
        deltaLonSeconds = deltaLon * 60 * 60;
        p = 0.0001 * Math.abs(deltaLonSeconds);

        el2 = ellipsoid.getEl2();
        eta = el2 * Math.pow(Math.cos(latRad), 2.0);
        el4 = eta * eta;
        el6 = el4 * eta;
        el8 = el6 * eta;

        T18 = Math.sin(latRad);
        T19 = Math.sin(latRad) * Math.pow(Math.cos(latRad), 2) / 3.0
                * (1 + 3 * el2 * Math.pow(Math.cos(latRad), 2) + 2 * el4 * Math.pow(Math.cos(latRad), 4));
        T20 = Math.sin(latRad) * Math.pow(Math.cos(latRad), 4) / 15.0
                * (2 - Math.pow(Math.tan(latRad), 2) + 15 * el2 * Math.pow(Math.cos(latRad), 2) + 35 * el4 * Math.pow(Math.cos(latRad), 4) - 15 * Math.pow(Math.tan(latRad), 2) * el2 * Math.pow(Math.cos(latRad), 2) + 33 * el6 * Math.pow(Math.cos(latRad), 6)
                - 50 * Math.pow(Math.tan(latRad), 2) * el4 * Math.pow(Math.cos(latRad), 4) + 11 * el8 * Math.pow(Math.cos(latRad), 8) - 60 * Math.pow(Math.tan(latRad), 2) * el6 * Math.pow(Math.cos(latRad), 6)
                - 24 * Math.pow(Math.tan(latRad), 2) * el8 * Math.pow(Math.cos(latRad), 8));

        C5 = (T20 * Math.pow(sin1, 4)) * 1E20;

        f12 = T18 * 1E4;
        f13 = (T19 * Math.pow(sin1, 2)) * 1E12;

        convergence = f12 * p + f13 * Math.pow(p, 3) + C5 * Math.pow(p, 5);
        convergence = Math.abs(convergence);
        
        if ((deltaLon < 0 && latRad > 0) || (deltaLon > 0 && latRad < 0)) {
            convergence *= -1;
        }

        return new AngleValue(convergence / 3600);
    }

    this.scaleCorrection = function(_coordinate) {
        latRad = _coordinate.getLatitude().toRadians();
        lon = _coordinate.getLongitude().toDegreeDecimal();
        lon0 = _coordinate.getLongitude().getCentralMeridian().toDegreeDecimal();

        el2 = ellipsoid.getEl2();
        eta = el2 * Math.pow(Math.cos(latRad), 2.0);
        el4 = eta * eta;
        el6 = el4 * eta;

        deltaLon = lon - lon0;
        deltaLonSeconds = deltaLon * 60 * 60;
        p = 0.0001 * Math.abs(deltaLonSeconds);

        T26 = Math.pow(Math.cos(latRad), 2) / 2 * (1 + el2 * Math.pow(Math.cos(latRad), 2));
        T27 = Math.pow(Math.cos(latRad), 4)
                / 24.0 * (5 - 4 * Math.pow(Math.tan(latRad), 2) + 14 * el2 * Math.pow(Math.cos(latRad), 2) + 13 * el4 * Math.pow(Math.cos(latRad), 4) - 28 * Math.pow(Math.tan(latRad), 2) * el2 * Math.pow(Math.cos(latRad), 2) + 4 * el6 * Math.pow(Math.cos(latRad), 6)
                - 48 * Math.pow(Math.tan(latRad), 2) * el4 * Math.pow(Math.cos(latRad), 4) - 24 * Math.pow(Math.tan(latRad), 2) * el6 * Math.pow(Math.cos(latRad), 6));

        f20 = T26 * Math.pow(sin1, 2) * 1E8;
        f21 = T27 * Math.pow(sin1, 4) * 1E16;

        return scaleFactor0 * (1 + (f20 * Math.pow(p, 2)) + (f21 * Math.pow(p, 4)));
    }
    
}
