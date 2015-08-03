var format = require('string-format');
format.extend(String.prototype);

var moment = require('moment');

var Table = require('easy-table');
var hourlyTable = new Table;

function parseRow(row) {
    row.time = moment(new Date(row.time*1000));
    return row;
}

function parseData(data) {
    var forecast = JSON.parse(data);
    forecast.flags.tempUnit = forecast.flags.units === 'si' ? '°C' : '°F';
    forecast.currently = parseRow(forecast.currently);
    forecast.hourly.data.forEach(function(hour) {
	hour = parseRow(hour);
    });
    return forecast;
}

module.exports = {
     hourly: function(forecast, nDays) {
	forecast.hourly.data.forEach(function(hour) {
	    if (hourlyTable.rows.length < nDays)  {
		var isSameHour = moment(forecast.currently.time).isSame(hour.time, 'hour');
		hourlyTable.cell('', isSameHour ? '*' : '');
		hourlyTable.cell('Date', moment(hour.time).calendar());
		hourlyTable.cell('Temp' , hour.temperature);
		hourlyTable.cell('_' , forecast.flags.tempUnit);
		hourlyTable.cell('Forecast', hour.summary);
		hourlyTable.newRow();
	    }
	});
	if (hourlyTable.rows.length) {
	    var hourStringTable = hourlyTable.toString()
	    hourlyTable.sort(['Temp']);
	    console.log("min temperature is {Temp} {_}, {Date}".format(hourlyTable.rows[0]));
	    console.log("max temperature is {Temp} {_}, {Date}".format(hourlyTable.rows[hourlyTable.rows.length-1]));
	    console.log("\n", hourStringTable);
	}
	return forecast;
    },

     forecast: function(data, addr) {
	var forecast = parseData(data);
	forecast.address = addr;
	var message = "Hello, we are in '{address}' at {currently.time}\n" +
	    "\n" +
	    "The temperature is about {currently.temperature}{flags.tempUnit}.\n" +
	    "By the way, outside is '{currently.summary}' (Or just look at the windows..).\n";
	console.log(message.format(forecast));
	return forecast;
    }

}
