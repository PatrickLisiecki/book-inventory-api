require("dotenv").config();
const express = require("express");
const { query } = require("./database");
const port = 7777;

const app = express();

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

app.use((req, res, next) => {
    console.log(`Request: ${req.method} ${req.originalUrl}`);
    next();
});

app.get("/", (req, res) => {
    res.send("Book Inventory API");
});

// Add a book to the books table
app.post("/books", async (req, res) => {
    const { title, genre, quantity } = req.body;
    const postBookQuery = `INSERT INTO books (title, genre, quantity) VALUES ($1, $2, $3) RETURNING *`;

    try {
        const newBook = await query(postBookQuery, [title, genre, quantity]);

        res.status(201).send(newBook.rows[0]);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Get every book from the books table
app.get("/books", async (req, res) => {
    const getBooksQuery = `SELECT * FROM books;`;

    try {
        const allBooks = await query(getBooksQuery);

        const isEmpty = allBooks.rows.length === 0;

        isEmpty
            ? res.status(200).send({ message: "Table is empty!" })
            : res.status(200).send(allBooks.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Get a book by its specific id
app.get("/books/:bookId", async (req, res) => {
    const targetId = parseInt(req.params.bookId, 10);
    const getBookQuery = `SELECT * FROM books WHERE id = $1`;

    try {
        const book = await query(getBookQuery, [targetId]);

        const missingBook = book.rows.length === 0;

        missingBook
            ? res
                  .status(200)
                  .send({ message: `Book #${targetId} does not exist!` })
            : res.status(200).send(book.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Update a book by its id
app.patch("/books/:bookId", async (req, res) => {
    const targetId = parseInt(req.params.bookId, 10);
    const { title, genre, quantity } = req.body;

    const fieldNames = ["title", "genre", "quantity"].filter(
        (name) => req.body[name]
    );

    let updatedValues = fieldNames.map((name) => req.body[name]);
    const setValuesSQL = fieldNames
        .map((name, i) => {
            return `${name} = $${i + 1}`;
        })
        .join(", ");

    const updateBookQuery = `UPDATE books SET ${setValuesSQL} WHERE id = $${
        fieldNames.length + 1
    } RETURNING *`;

    try {
        const updatedBook = await query(updateBookQuery, [
            ...updatedValues,
            targetId,
        ]);

        const success = updatedBook.rows.length > 0;

        success
            ? res.status(200).send(updatedBook.rows[0])
            : res
                  .status(404)
                  .send({ message: `Book #${targetId} does not exist!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Remove a book from the books table by id
app.delete("/books/:bookId", async (req, res) => {
    const targetId = parseInt(req.params.bookId, 10);
    const deleteBookQuery = `DELETE FROM books WHERE id = $1`;

    try {
        const deletedBook = await query(deleteBookQuery, [targetId]);

        const success = deletedBook.rowCount > 0;

        success
            ? res.status(200).send({ message: `Book #${targetId} deleted.` })
            : res
                  .status(404)
                  .send({ message: `Book #${targetId} does not exist!` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error." });
    }
});
