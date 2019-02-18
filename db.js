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
        'INSERT INTO signatures(firstName, lastName, signature) VALUES($1, $2, $3)',
        [firstName || null, lastName || null, signature || null],
    );
};
module.exports.listSignatures = function listSignatures() {
    return db.query('SELECT firstName, lastName FROM signatures ');
};

module.exports.getUserId = function getUserId(id) {
    return db.query('SET cookie WHERE id = $1', [id]);
};
