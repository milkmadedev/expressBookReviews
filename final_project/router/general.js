const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Simulate an external API call
const simulateApiCall = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 100);
  });
};

// Task 10: Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await simulateApiCall(Object.values(books));
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = await simulateApiCall(books[isbn]);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book details" });
  }
});

// Task 12: Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const booksByAuthor = await simulateApiCall(
      Object.values(books).filter(book => book.author === author)
    );
    if (booksByAuthor.length > 0) {
      res.status(200).json(booksByAuthor);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Task 13: Get book details based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const booksByTitle = await simulateApiCall(
      Object.values(books).filter(book => book.title === title)
    );
    if (booksByTitle.length > 0) {
      res.status(200).json(booksByTitle);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books by title" });
  }
});

module.exports.general = public_users;