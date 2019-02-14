//database query
var spicedPg = require('spiced-pg');

var db = spicedPg(
    'postgres:spicedling:password@localhost:5432/wintergreen-petition',
);
//THIS QUERY WONT WORK BCAUSE I DONT HAVE A TABLE CALLED CITIES
//THIS QUERY IS JUST FOR DEMO PURPOSES
module.exports.getAllCities = function getAllCities() {
    return db.query('SELECT * FROM cities');
};

module.exports.addCitty = function addCity(city, state) {
    db.query('INSERT INTO cities(city) VALUES($1, $2)', [city, state]);
    // arguments that are inside of the function
};
