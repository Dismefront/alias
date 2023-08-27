import pg from 'pg';

export const pool = new pg.Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    database: "alias",
    port: 5432,
});
