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

module.exports.register = function register(
    firstName,
    lastName,
    email,
    hashedPsswd,
) {
    return db.query(
        'INSERT INTO users (firstName, lastName, email, password) VALUES ($1, $2, $3, $4)  RETURNING id, firstName, lastName'[
            (firstName || null, lastName || null, email || null, password ||
                null)
        ],
    );
};
module.exports.getEmail = function getEmail(email) {
    return db.query('SELECT * FROM users WHERE email = $1', [email]);
};
