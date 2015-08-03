var https = require('https');
var fs = require('fs');
var path = require('path');
var Q = require('q');

var _getResponse = function (conf, lat, lon) {
    var deffered = Q.defer();
    var path = "{api}/{lat},{long}?units={unit}"
	.replace("{api}", conf.api_key)
	.replace('{lat}', lat)
	.replace('{long}', lon)
	.replace('{unit}', conf.units);
    var host = "https://api.forecast.io/forecast/";
    var options = {
	host: host,
	path: path,
	method: 'GET'
    };
    https.get(host + path, function(res) {
	var buff = '';
	res.on('data', function(chunk) {
	    buff += chunk;
	}).on('end', function() {
	    deffered.resolve(buff);
	}).on('error', function(err) {
	    deffered.reject(err);
	});
    }).on('error', function(err) {
	deffered.reject(err);
    });
    return deffered.promise;
}

var Forecast = {

    getForecast: function (conf, addr) {
	return 	_getResponse(conf, addr.latitude, addr.longitude);
    }
};

module.exports = Forecast
