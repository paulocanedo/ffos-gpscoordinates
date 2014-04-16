function calcCentralMeridian(zone) {
    return 6 * zone - 183;
}

function getCentralMeridian(zone) {
    return new Longitude(calcCentralMeridian(zone));
}

function Longitude(longitude) {
    if (longitude < -180.0 || longitude > 180.0) {
            throw new IllegalArgumentException("Valor de longitude incorreto: " + longitude);
    }
    this.delegate = new AngleValue(longitude);

    this.getCentralMeridian = function() {
        return getCentralMeridian(this.getZone());
    }

    this.getZone = function() {
        var longitude = this.delegate.toDegreeDecimal();
        if (longitude < 0.0) {
            return (Math.truncate((180 + longitude) / 6.0)) + 1;
        } else {
            return (Math.truncate(longitude / 6)) + 31;
        }
    }

    addMethod(this, "toString", function() {
        var value = this.delegate.toString("dd" + UNICODE_DEGREE + "mm\'ss\" EW");
        value = value.replace("EW", this.delegate.isPositive() ? "E" : "W");

        return value;
    });

    addMethod(this, "toString", function(pattern, precision) {
        var value = this.delegate.toString(pattern, precision);
        value = value.replace("EW", this.delegate.isPositive() ? "E" : "W");

        return value;
    });

    this.toMeridianCentralString = function() {
        return this.toString("dd" + UNICODE_DEGREE + "EWgr", 0);
    }

    this.toDegreeDecimal = function() {
        return this.delegate.toDegreeDecimal();
    }

    this.toRadians = function() {
        return this.delegate.toRadians();
    }
}
