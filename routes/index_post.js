var request = require("request");

var apiURL = 'http://query.yahooapis.com/v1/public/yql?format=json&q=select * from geo.placefinder where gflags="R" and text="{LAT},{LON}"';


var reverseGeo = function(lat, lon, callback) {
    var url = apiURL.replace("{LAT}", lat).replace("{LON}", lon);

    request(url, function(error, response, contentBody) {
        
        var address;
        try {
            address = JSON.parse(contentBody).query.results.Result;
            address = Array.isArray(address) ? address[0] : address;
            address = address.line1 + " " + address.line2;
        }
        catch(e) {
            callback("Could not retrieve the location at "+lat+", "+lon);
            return;
        }

        if (error || response.statusCode != 200) {
            callback("Error contacting the reverse geocoding service.");
        }
        else { db.Breadcrumb.create([
                {
                    date: new Date(),
                    latitude: lat,
                    longitude: lon,
                    address: address
                }
            ], function (err, items) {
                callback(err, address);
            });
        }
    });
};

module.exports = function(req, res) {
    var latitude = req.body.latitude;
    var longitude = req.body.longitude;

    reverseGeo(latitude, longitude, function(err, address) {

        db.Breadcrumb.find(function(err, items) {
        res.render('home', {
            error: err,
            location: {
                latitude: latitude,
                longitude: longitude,
                address: address
            },
            breadcrumbs: items
        });
    });
};