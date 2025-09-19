const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files (HTML, CSS, JS) from the current directory
app.use(express.static(__dirname));

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Sample initial data
let books = [
  { id: 1, title: "Book One", author: "Author One", year: 2001 },
  { id: 2, title: "Book Two", author: "Author Two", year: 2002 },
];

// ========== API ENDPOINTS ==========

// GET all books
app.get("/books", (req, res) => {
  res.json(books);
});

// GET book by ID
app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.json(book);
});

// POST new book
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;

  if (!title || !author || !year) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const newBook = {
    id: books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1,
    title,
    author,
    year: parseInt(year),
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT update book
app.put("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { title, author, year } = req.body;
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  if (!title || !author || !year) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  books[bookIndex] = { id, title, author, year: parseInt(year) };
  res.json(books[bookIndex]);
});

// DELETE book
app.delete("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    return res.status(404).json({ error: "Book not found" });
  }

  books.splice(bookIndex, 1);
  res.status(204).send();
});

// Serve the HTML page for the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Open this URL in your browser to access the book manager");
});
