var DATUM_WGS84 = new Datum(63781370, 6356752.314245, 298.257223563);
var DATUM_SIRGAS = new Datum(6378137, 6356752.31413, 298.257222101);
var DATUM_GRS80 = new Datum(6378137, 6356752.31413, 298.257222101);

function Datum(_a, _b, _inverseFlattening) {

    var A0;
    var B0;
    var C0;
    var D0;
    var E0;
    var a;
    var b;
    var flattening;
    var inverseFlattening;
    var n;
    var rm;
    var e;
    var e1sq;

    a = _a;
    b = _b;
    inverseFlattening = _inverseFlattening;

    this.calculateAllValues = function() {
        if (flattening == undefined) {
            flattening = this.calculateFlattening();
        }

        if (inverseFlattening == undefined) {
            inverseFlattening = this.calculateInverseFlattening();
        }

        if (n == 0) {
            n = this.calculate_n();
        }

        if (rm == 0) {
            rm = this.calculateMeanRadius();
        }

        if (e == 0) {
            e = this.calculateEccentricity();
        }

        if (e1sq == 0) {
            e1sq = this.calculateEccentricitySq();
        }

        A0 = this.calculateA0();
        B0 = this.calculateB0();
        C0 = this.calculateC0();
        D0 = this.calculateD0();
        E0 = this.calculateE0();
    }

    this.calculate_n = function() {
        return (a - b) / (a + b);
    }

    this.calculateFlattening = function() {
        return (a - b) / a;
    }

    this.calculateInverseFlattening = function() {
        return 1 / flattening;
    }

    this.calculateMeanRadius = function() {
        return Math.pow(a * b, 1 / 2.0);
    }

    this.calculateEccentricity = function() {
        return Math.sqrt(1 - Math.pow(b / a, 2));
    }

    this.calculateEccentricitySq = function() {
        return e * e / (1 - e * e);
    }

    this.calculateA0 = function() {
        return a * (1 - n + 5 / 4.0 * (Math.pow(n, 2) - Math.pow(n, 3)) + 81 / 64.0 * (Math.pow(n, 4) - Math.pow(n, 5)));
    }

    this.calculateB0 = function() {
        return 3 / 2.0 * a * (n - Math.pow(n, 2) + (7 / 8.0) * (Math.pow(n, 3) - Math.pow(n, 4) + (55 / 64.0) * Math.pow(n, 5)));
    }

    this.calculateC0 = function() {
        return 15 / 16.0 * a * (Math.pow(n, 2) - Math.pow(n, 3) + (3 / 4.0) * (Math.pow(n, 4) - Math.pow(n, 5)));
    }

    this.calculateD0 = function() {
        return 35 / 48.0 * a * (Math.pow(n, 3) - Math.pow(n, 4) + (11 / 16.0) * Math.pow(n, 5));
    }

    this.calculateE0 = function() {
        return 315 / 512.0 * a * (Math.pow(n, 4) - Math.pow(n, 5));
    }

    this.getSemiMajorAxis = function() {
        return a;
    }

    this.getSemiMinorAxis = function() {
        return b;
    }

    this.getFlattening = function() {
        return flattening;
    }

    this.getInverseFlattening = function() {
        return inverseFlattening;
    }

    this.getMeanRadius = function() {
        return rm;
    }

    this.getEccentricity = function() {
        return e;
    }

    this.getEccentricitySq = function() {
        return e1sq;
    }

    this.getA0 = function() {
        return A0;
    }

    this.getB0 = function() {
        return B0;
    }

    this.getC0 = function() {
        return C0;
    }

    this.getD0 = function() {
        return D0;
    }

    this.getE0 = function() {
        return E0;
    }

    this.calculateAllValues();
}
