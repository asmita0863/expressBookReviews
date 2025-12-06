const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // isValid returns true when username is NOT taken
  if (!isValid(username)) {
    return res.status(400).json({ message: "User already exists!" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop (uses axios + async/await)
public_users.get('/', async function (req, res) {
  try {
    const host = req.protocol + '://' + req.get('host');
    const response = await axios.get(host + '/all-books');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching books', error: err.message });
  }
});

// internal route used by the root handler when demonstrating axios/promises
public_users.get('/all-books', (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const host = req.protocol + '://' + req.get('host');
    const response = await axios.get(host + '/all-books');
    const allBooks = response.data;

    const book = Object.values(allBooks).find(b => b.isbn === isbn);

    if (book) {
      return res.status(200).json({ book: book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching book details', error: err.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const authorName = req.params.author.toLowerCase();

  try {
    const host = req.protocol + '://' + req.get('host');
    const response = await axios.get(host + '/all-books');
    const allBooks = response.data;

    const matchedBooks = Object.values(allBooks).filter(
      book => book.author.toLowerCase() === authorName
    );

    if (matchedBooks.length > 0) {
      return res.status(200).json({ books: matchedBooks });
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching books by author', error: err.message });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleQuery = req.params.title.toLowerCase();

    // Filter books by matching title (case-insensitive)
    const matchedBooks = Object.values(books).filter(
        book => book.title.toLowerCase() === titleQuery
    );

    if (matchedBooks.length > 0) {
        return res.status(200).json({ books: matchedBooks });
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

    // Find the book by ISBN
    const book = Object.values(books).find(b => b.isbn === isbn);

    if (book) {
        return res.status(200).json({ reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
