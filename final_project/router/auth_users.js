const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "testuser", password: "testpass" },
    { username: "anotheruser", password: "anotherpass" }
];

const SECRET_KEY = 'your_secret_key';

// Simplified user authentication
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticatedUser(username, password)) {
        let token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
        req.session.token = token;
        req.session.username = username;
        return res.status(200).json({ message: "Login successful", token });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
    if (req.session.token) {
        next();
    } else {
        return res.status(401).json({ message: "Unauthorized. Please login." });
    }
};

// Add or modify a book review
regd_users.put("/auth/review/:isbn", isLoggedIn, (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username;

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ 
        message: "Review added/modified successfully",
        book: books[isbn]
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", isLoggedIn, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({ 
        message: "Review deleted successfully",
        book: books[isbn]
    });
});

module.exports = { regd_users, users };