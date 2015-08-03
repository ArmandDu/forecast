var geocoderProvider = 'google';
var httpAdapter = 'http';
 
var geocoder =  require('node-geocoder')(geocoderProvider, httpAdapter);

var GeoCode = {

  
    convertAddress: function(address) {
	return geocoder.geocode(address);
    }

};

module.exports = GeoCode
