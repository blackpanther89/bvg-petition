
CREATE TABLE signatures(
    id SERIAL primary key,
    firstName VARCHAR(255) not null,
    lastName VARCHAR(255) not null,
    signature text
--     -- user_id not null references users(id)
-- )
--
--  -- CREATE TABLE users(
--  --     id SERIAL primary key,
--  --     firstName VARCHAR(255) not null check firstName <> (''),
--  --     lastName VARCHAR(255) not null,
--  --     email VARCHAR(255), not null unique,
--  --     password VARCHAR(255), not null
--  --
--  -- )
