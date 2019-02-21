DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures(
    id SERIAL primary key,
    -- firstName VARCHAR(255) not null,
    -- lastName VARCHAR(255) not null,
    signature text,
    user_id INT not null
);
DROP TABLE IF EXISTS user_profiles;
CREATE TABLE user_profiles(
    id  SERIAL primary key,
    age INT,
    city VARCHAR(255),
    url VARCHAR(300),
    user_id INT not null unique

);
DROP TABLE IF EXISTS users;
 CREATE TABLE users(
     id SERIAL primary key,
     firstName VARCHAR(255) not null,
     lastName VARCHAR(255) not null,
     email VARCHAR(255) not null unique,
     password VARCHAR(255) not null

 );
