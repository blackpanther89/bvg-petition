DROP TABLE IF EXISTS users;
 CREATE TABLE users(
     id SERIAL primary key,
     firstName VARCHAR(255) not null,
     lastName VARCHAR(255) not null,
     email VARCHAR(255) not null unique,
     password VARCHAR(255) not null

 );
