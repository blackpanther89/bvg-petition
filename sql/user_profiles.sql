DROP TABLE IF EXISTS user_profiles;
CREATE TABLE user_profiles(
    id  SERIAL primary key,
    age INT,
    city VARCHAR(255),
    url VARCHAR(300),
    user_id not null unique

);
