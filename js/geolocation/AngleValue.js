function dms2dd(degree, minute, second, positive) {
    if (positive) {
        return degree + (minute / 60.0) + (second / 3600.0);
    } else {
        return -degree - (minute / 60.0) - (second / 3600.0);
    }
}

function dd2dms(decimalDegree) {
    var positive = true;
    var toReturn = new Array();
    if (decimalDegree < 0) {
        decimalDegree = -decimalDegree;
        positive = false;
    }

    var degree, minute;
    degree = Math.truncate(decimalDegree);

    var decimalMinute = (decimalDegree - degree) * 60;
    minute = Math.truncate(decimalMinute);

    var decimalSecond = (decimalMinute - minute) * 60;

    if (decimalSecond == 60) {
        decimalSecond = 0;
        minute++;
    }

    if (minute == 60) {
        minute = 0;
        degree++;
    }

    toReturn[0] = degree;
    toReturn[1] = minute;
    toReturn[2] = decimalSecond;
    toReturn[3] = positive;
    return toReturn;
}

var UNICODE_DEGREE = "\u00b0";

function AngleValue(dValue) {
	this.decimalValue = dValue;
	this.fragmentedValue = dd2dms(dValue);

	this.isPositive = function() {
	    return this.decimalValue > 0;
	}

	this.getDegree = function() {
	    return this.fragmentedValue[0];
	}

	this.getMinute = function() {
	    return this.fragmentedValue[1];
	}

	this.getSecond = function() {
	    return this.fragmentedValue[2];
	}

	this.toDegreeDecimal = function() {
	    return this.decimalValue;
	}

	this.toRadians = function() {
	    return Math.toRadians(this.toDegreeDecimal());
	}

    addMethod(this, "toString", function() {
        return this.toString("+-dd" + UNICODE_DEGREE + "mm\'ss\"");
    });


    addMethod(this, "toString", function(pattern) {
        return this.toString(pattern, 5);
    });

    addMethod(this, "toString", function(pattern, precision) {
        var value = pattern;

        value = value.replace("+", this.isPositive() ? "+" : "");
        value = value.replace("-", this.isPositive() ? "" : "-");
        value = value.replace("dd", Math.pad(this.getDegree(), 2));
        value = value.replace("mm", Math.pad(this.getMinute(), 2));

        var second = this.getSecond().toFixed(precision);
        if (this.getSecond() < 10) {
            second = "0" + second;
        }
        value = value.replace("ss", second);

        return value;
    });

}