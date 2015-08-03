#!/usr/bin/env nodejs

var config = require('./src/config');

var geocode = require('./src/geocode');
var forecast = require('./src/forecast');
var display = require('./src/display');

var argv = require('minimist')(process.argv.slice(2));
var addr = argv['_'];
var hours = argv['H'] || argv['hours'];
var USAGE = "Usage: forecast <address> [-H|--hours HOURS] [-h|--help]\n"

if (argv['help'] || argv['h']){
    console.log(USAGE);
    return 0;
}

if (addr.length == 0) {
    addr = config.location;
}

geocode.convertAddress(addr)
    .then(function(res) {
	return forecast.getForecast(config.forecast, res[0])
	    .then(function(data){
		return display.forecast(data, addr)
	    })
	    .then(function(forecast) {
		return display.hourly(forecast, hours);
	    })
    })
    .catch(function(err){
	console.log(err);
    });
