function calcS(A, B, C, D, E, _latRad) {
    return A * _latRad - B * Math.sin(2 * _latRad) + C * Math.sin(4 * _latRad) - D * Math.sin(6 * _latRad) + E * Math.sin(8 * _latRad);
}

function Ellipsoid(_datum) {

    var a;
    var b;
    var e2;
    var el2;
    var n;
    var A;
    var B;
    var C;
    var D;
    var E;
    var datum;

    datum = _datum;
    a = datum.getSemiMajorAxis();
    b = datum.getSemiMinorAxis();

    n = (a - b) / (a + b);

    e2 = (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(a, 2);
    el2 = (Math.pow(a, 2) - Math.pow(b, 2)) / Math.pow(b, 2);

    A = a * (1 - n + 5 / 4.0 * (Math.pow(n, 2) - Math.pow(n, 3)) + 81 / 64.0 * (Math.pow(n, 4) - Math.pow(n, 5)));
    B = 3 / 2.0 * a * (n - Math.pow(n, 2) + (7 / 8.0) * (Math.pow(n, 3) - Math.pow(n, 4) + (55 / 64.0) * Math.pow(n, 5)));
    C = 15 / 16.0 * a * (Math.pow(n, 2) - Math.pow(n, 3) + (3 / 4.0) * (Math.pow(n, 4) - Math.pow(n, 5)));
    D = 35 / 48.0 * a * (Math.pow(n, 3) - Math.pow(n, 4) + (11 / 16.0) * Math.pow(n, 5));
    E = 315 / 512.0 * a * (Math.pow(n, 4) - Math.pow(n, 5));

    this.getE2 = function() {
        return e2;
    }

    this.getN = function() {
        return n;
    }

    this.getEl2 = function() {
        return el2;
    }

    this.calcRHO = function(_latRad) {
        return a * (1 - e2)
                / Math.pow(1 - e2 * Math.pow(Math.sin(_latRad), 2), 3 / 2.0);
    }

    this.calcNU = function(_latRad) {
        return a / Math.sqrt(1.e0 - e2 * Math.pow(Math.sin(_latRad), 2.0));
    }

    this.calcS = function(_latRad) {
        return calcS(A, B, C, D, E, _latRad);
    }

    this.getDatum = function() {
        return datum;
    }
    
}
