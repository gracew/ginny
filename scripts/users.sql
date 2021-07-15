CREATE TABLE users (
    id text PRIMARY KEY,
    first_name text not null,
    last_name text not null,
    email text not null,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);