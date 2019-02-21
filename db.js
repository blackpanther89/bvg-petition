//database query
var spicedPg = require('spiced-pg');

var db = spicedPg(
    'postgres:postgres:postgres@localhost:5432/wintergreen-petition',
);

exports.createSignature = function createSignature(
    // firstName,
    // lastName,
    signature,
    user_id,
) {
    return db.query(
        'INSERT INTO signatures (signature, user_id) VALUES($1, $2) RETURNING id',
        [signature, user_id],
    );
};
module.exports.getSignatures = function getSignatures() {
    return db.query(
        `SELECT firstName, lastName, age, city, url FROM users
        LEFT JOIN user_profiles ON users.id =  user_profiles.user_id`,
    );
};

module.exports.getSignature = function getSignature(id) {
    return db.query('SELECT * FROM signatures WHERE id = $1', [id]);
};

exports.register = function(firstName, lastName, email, password) {
    return db.query(
        `INSERT INTO users (firstName, lastName, email, password)
        VALUES ($1, $2, $3, $4)  RETURNING id, firstName, lastName`,
        [firstName || null, lastName || null, email || null, password || null],
    );
};
exports.getEmail = function getEmail(email) {
    return db.query(
        `SELECT firstName, lastName, password, users.id, signatures.id
        AS sigiD
        FROM users
        LEFT JOIN signatures
        ON users.id = signatures.user_id WHERE email=$1`,
        [email],
    );
};

exports.userInfo = function userInfo(age, city, url, user_id) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)`,
        [age, city, url, user_id],
    );
}; //insert for new user_profiles

exports.getCity = function getCity(city) {
    return db.query(
        `SELECT city
        FROM user_profiles
        LEFT JOIN users
        ON users.id = user_profiles.user_id WHERE city=$1`,
        [city],
    );
};
