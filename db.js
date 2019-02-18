//database query
var spicedPg = require('spiced-pg');

var db = spicedPg(
    'postgres:postgres:postgres@localhost:5432/wintergreen-petition',
);

module.exports.getDetails = function getDetails(
    firstName,
    lastName,
    signature,
) {
    return db.query(
        'INSERT INTO signatures(firstName, lastName, signature) VALUES($1, $2, $3) RETURNING id',
        [firstName || null, lastName || null, signature || null],
    );
};
module.exports.listSignatures = function listSignatures() {
    return db.query('SELECT firstName, lastName, signature FROM signatures ');
};

module.exports.userSignature = function userSignature(id) {
    return db.query('SELECT * FROM signatures WHERE id = $1', [id]);
};

module.exports.register = function register() {
    return db.query(
        'INSERT INTO users (firstName, lastName, email, password )',
    );
};
module.exports.getEmail = function getEmail() {
    return db.query('SELECT email FROM users');
};
