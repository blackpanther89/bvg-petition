//database query
var spicedPg = require('spiced-pg');

var db = spicedPg(
    'postgres:spicedling:password@localhost:5432/wintergreen-petition',
);

module.exports.getDetails = function getDetails(
    firstName,
    lastName,
    signature,
) {
    return;
    db.query('INSERT INTO petition  VALUES($1, $2, $3)', [
        firstName,
        lastName,
        signature,
    ]);
};
module.exports.listSignatures = function listSignatures() {
    return;
    db.query('SELECT firstName, lastName FROM petition ');
};
