function Point2D(_x, _y) {
	var x;
	var y;

	x = _x;
	y = _y;

	this.getX = function() {
		return x;
	}

	this.getY = function() {
		return y;
	}

	this.setX = function(_x) {
		x = _x;
	}

	this.x = function(_x) {
		this.setX(_x);
	}

	this.setY = function(_y) {
		y = _y;
	}

	this.y = function(_y) {
		this.setY(_y);
	}

	this.location = function(_x, _y) {
		this.x(_x);
		this.y(_y);
	}

	this.toString = function() {
		return '' + x.toFixed(3) + ", " + y.toFixed(3);
	}
}