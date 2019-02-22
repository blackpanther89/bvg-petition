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
    return db.query('SELECT * FROM signatures WHERE user_id = $1', [id]);
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
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [age, city, url, user_id],
    );
}; //insert for new user_profiles

exports.getCity = function getCity(city) {
    return db.query(
        `SELECT
        users.firstName
        users.lastName
        user_profiles.age
        user_profiles.city
        FROM user_profiles
        LEFT JOIN users
        ON users.id = user_profiles.user_id
        WHERE city=$1`,
        [city],
    );
};
exports.update = function update() {
    return db.query([]);
};

exports.getUsers = function getUsers() {
    return db.query(`SELECT * FROM users`);
};

exports.getSignatures = function getSignatures() {
    return db.query(`SELECT * FROM signatures`);
};

exports.getProfiles = function getProfiles() {
    return db.query(`SELECT * FROM user_profiles`);
};

exports.dropProfiles = function dropProfiles() {
    return db.query(`DROP TABLE IF EXISTS user_profiles`);
};

exports.createProfiles = function createProfiles() {
    return db.query(
        `CREATE TABLE user_profiles(
        id  SERIAL primary key,
        age INT,
        city VARCHAR(255),
        url VARCHAR(300),
        user_id INT REFERENCES users(id) not null unique)`
    );
};



exports.refresh = function refresh() {
    return db.query(
        `DROP TABLE IF EXISTS signatures;
    DROP TABLE IF EXISTS user_profiles;
    DROP TABLE IF EXISTS users;

    CREATE TABLE signatures(
        id SERIAL primary key,
        -- firstName VARCHAR(255) not null,
        -- lastName VARCHAR(255) not null,
        signature text,
        user_id INT not null
    );

    CREATE TABLE user_profiles(
        id  SERIAL primary key,
        age INT,
        city VARCHAR(255),
        url VARCHAR(300),
        user_id INT REFERENCES users(id) not null unique
    );

     CREATE TABLE users(
         id SERIAL primary key,
         firstName VARCHAR(255) not null,
         lastName VARCHAR(255) not null,
         email VARCHAR(255) not null unique,
         password VARCHAR(255) not null

     );`,
    );
};
