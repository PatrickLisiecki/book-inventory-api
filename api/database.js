const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

const createBooksTableQuery = `
    CREATE TABLE IF NOT EXISTS books (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL
    );
`;

const createBooksTable = async () => {
    try {
        await pool.query(createBooksTableQuery);
        console.log("Books table created successfully");
    } catch (err) {
        console.error("Error executing query", err.stack);
    }
};

createBooksTable();

module.exports = {
    query: (text, params, callback) => {
        console.log("QUERY:", text, params || "");
        return pool.query(text, params, callback);
    },
};
