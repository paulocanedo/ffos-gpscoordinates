Math.truncate = function(_value) {
  if (_value<0) return Math.ceil(_value);
  else return Math.floor(_value);
}

Math.toRadians = function(_value) {
	return _value * (Math.PI / 180);
}

Math.toDegrees = function(_value) {
	return _value * (180 / Math.PI);
}

Math.pad = function(_value, length) {  
    var str = '' + _value;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;
}

// addMethod - By John Resig (MIT Licensed)
function addMethod(object, name, fn){
    var old = object[ name ];
    object[ name ] = function(){
        if ( fn.length == arguments.length )
            return fn.apply( this, arguments );
        else if ( typeof old == 'function' )
            return old.apply( this, arguments );
    };
}