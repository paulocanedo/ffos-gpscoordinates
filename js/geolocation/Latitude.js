Hemisphere_NORTH = 0;
Hemisphere_SOUTH = 1;

function Latitude(dValue) {
	this.delegate = new AngleValue(dValue);
    if (this.delegate.toDegreeDecimal() < -80.0 || this.delegate.toDegreeDecimal() > 84.0) {
        throw ("Valor de latitude incorreto: " + this.delegate.toString());
    }

    this.getHemisphere = function() {
        return this.delegate.isPositive() ? Hemisphere_NORTH : Hemisphere_SOUTH;
    }

    addMethod(this, "toString", function() {
        var value = this.delegate.toString("dd" + UNICODE_DEGREE + "mm\'ss\" NS");
        value = value.replace("NS", this.delegate.isPositive() ? "N" : "S");

        return value;
    });

    addMethod(this, "toString", function(pattern, precision) {
        var value = this.delegate.toString(pattern, precision);
        value = value.replace("NS", this.delegate.isPositive() ? "N" : "S");

        return value;
    });

    this.toDegreeDecimal = function() {
        return this.delegate.toDegreeDecimal();
    }

    this.toRadians = function() {
        return this.delegate.toRadians();
    }
}
