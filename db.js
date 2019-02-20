//database query
var spicedPg = require('spiced-pg');

var db = spicedPg(
    'postgres:postgres:postgres@localhost:5432/wintergreen-petition',
);

module.exports.createSignature = function createSignature(
    firstName,
    lastName,
    signature,
) {
    return db.query(
        'INSERT INTO signatures(firstName, lastName, signature) VALUES($1, $2, $3) RETURNING id',
        [firstName || null, lastName || null, signature || null],
    );
};
module.exports.getSignatures = function getSignatures() {
    return db.query('SELECT firstName, lastName, signature FROM signatures ');
};

module.exports.getSignature = function getSignature(id) {
    return db.query('SELECT * FROM signatures WHERE id = $1', [id]);
};

exports.register = function(firstName, lastName, email, password) {
    return db.query(
        'INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)  RETURNING id, firstName, lastName',
        [firstName || null, lastName || null, email || null, password || null],
    );
};
exports.getEmail = function getEmail(email) {
    return db.query('SELECT * FROM users WHERE email = $1', [email]);
};

exports.userInfo = function userInfo(age, city, url, user_id) {
    return db.query(
        'INSERT INTO user_ptofiles (age, city, url, user_id) VALUES ($1, $2, $3, $4)',
        [age, city, url, user_id],
    );
}; //insert for new user_profiles

exporst.getCity = function getCity(city) {
    return db.query(
        'SELECT users.firstName, users.lastName, users_profiles.age, users_profiles.city, user_profiles.url FROM  users ON users.id = ',
    );
};
