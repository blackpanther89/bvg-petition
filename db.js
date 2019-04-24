//database query
var spicedPg = require('spiced-pg');

var db = spicedPg(
    process.env.DATABASE_URL ||
        'postgres:postgres:postgres@localhost:5432/wintergreen-petition',
);

exports.createSignature = function createSignature(signature, user_id) {
    return db.query(
        'INSERT INTO signatures (signature, user_id) VALUES($1, $2) RETURNING id',
        [signature, user_id],
    );
};
module.exports.getSignaturesPlus = function getSignaturesPlus(id) {
    return db.query(
        `SELECT * FROM signatures
         LEFT JOIN users ON signatures.user_id = users.id
         LEFT JOIN user_profiles ON signatures.user_id = user_profiles.user_id
         WHERE users.id= $1
         `,
        [id],
    );
};

module.exports.getNames = function getNames() {
    return db.query(
        `SELECT * FROM signatures
         LEFT JOIN users ON signatures.user_id = users.id
         LEFT JOIN user_profiles ON signatures.user_id = user_profiles.user_id
         `,
    );
};
module.exports.getSignature = function getSignature(id) {
    return db.query('SELECT * FROM signatures WHERE user_id = $1', [id]);
};

module.exports.register = function register(
    firstName,
    lastName,
    email,
    password,
) {
    return db.query(
        `INSERT INTO users (firstName, lastName, email, password)
        VALUES ($1, $2, $3, $4)  RETURNING id, firstName, lastName`,
        [firstName || null, lastName || null, email || null, password || null],
    );
};
module.exports.getEmail = function getEmail(email) {
    return db.query(
        `SELECT firstName, lastName, password, users.id, signatures.id
        AS sigiD
        FROM users
        LEFT JOIN signatures
        ON users.id = signatures.user_id WHERE email=$1`,
        [email],
    );
};

module.exports.userInfo = function userInfo(age, city, url, user_id) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4) RETURNING id`,
        [age, city, url, user_id],
    );
};

module.exports.getCity = function getCity(city) {
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
module.exports.updateProfile = function updateProfile(age, city, url, user_id) {
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id)
        DO UPDATE SET age = $1, city = $2, url = $3, user_id=$4
        RETURNING id`,
     [age, city, url, user_id]);
};

module.exports.editWithPassword = function editWithPassword(
    firstName,
    lastName,
    email,
    password,
    user_id,
) {
    return db.query(
        `UPDATE users
        SET firstName = $1, lastName = $2, email = $3, password = $4
        WHERE id = $5`,
        [firstName, lastName, email, password, user_id],
    );
};
module.exports.editWithoutPassword = function editWithoutPassword(
    firstName,
    lastName,
    email,
    user_id,
) {
    return db.query(
        `UPDATE users SET firstName =$1, lastName=$2, email=$3
        WHERE id=$4 `,
        [firstName, lastName, email, user_id],
    );
};
module.exports.deleteSig = function deleteSig(signature) {
    return db.query(`DELETE FROM signatures WHERE user_id = $1`, [signature]);
};
//===============================================================//
module.exports.getUsers = function getUsers() {
    return db.query(`SELECT * FROM users`);
};

module.exports.getSignatures = function getSignatures() {
    return db.query(`SELECT * FROM signatures`);
};

module.exports.getProfiles = function getProfiles() {
    return db.query(`SELECT * FROM user_profiles`);
};

module.exports.dropProfiles = function dropProfiles() {
    return db.query(`DROP TABLE IF EXISTS user_profiles`);
};

module.exports.createProfiles = function createProfiles() {
    return db.query(
        `CREATE TABLE user_profiles(
        id  SERIAL primary key,
        age INT,
        city VARCHAR(255),
        url VARCHAR(300),
        user_id INT REFERENCES users(id) not null unique)`,
    );
};

module.exports.refresh = function refresh() {
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

     )`,
    );
};
