const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

    // Find the book by ISBN
    const book = Object.values(books).find(b => b.isbn === isbn);

    if (book) {
        return res.status(200).json({ book: book });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author.toLowerCase();

    // Filter books by matching author (case-insensitive)
    const matchedBooks = Object.values(books).filter(
        book => book.author.toLowerCase() === authorName
    );

    if (matchedBooks.length > 0) {
        return res.status(200).json({ books: matchedBooks });
    } else {
        return res.status(404).json({ message: "No books found for this author" });
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
