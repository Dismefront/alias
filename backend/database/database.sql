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


DROP TABLE IF EXISTS themes;
DROP TABLE IF EXISTS words;