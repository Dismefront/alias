DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
    id VARCHAR(255) PRIMARY KEY,
    date_created TIMESTAMP
);


CREATE TABLE themes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);


CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    theme_id INTEGER,
    word VARCHAR(255),

    FOREIGN KEY (theme_id) REFERENCES themes (id)
);