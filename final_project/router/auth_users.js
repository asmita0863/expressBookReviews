const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // A username is valid when it is not already taken
  if (!username) return false;
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // Check if the username and password match a registered user
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Create JWT and store in session
  const accessToken = jwt.sign({ username: username }, 'access', { expiresIn: '1h' });
  req.session.authorization = { accessToken: accessToken, username: username };

  return res.status(200).json({ message: "User successfully logged in", accessToken: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const reviewText = req.query.review;

  if (!req.session || !req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "You must be logged in to post a review." });
  }

  const username = req.session.authorization.username;

  if (!reviewText) {
    return res.status(400).json({ message: "Review text is required as a query parameter 'review'." });
  }

  // Find the book by ISBN
  const book = Object.values(books).find(b => b.isbn === isbn);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Ensure reviews array exists
  if (!Array.isArray(book.reviews)) book.reviews = [];

  // Find existing review by this user (reviews can be stored as objects)
  const existingIndex = book.reviews.findIndex(r => (typeof r === 'object' && r.username === username));

  if (existingIndex !== -1) {
    // Update existing review
    book.reviews[existingIndex].review = reviewText;
    return res.status(200).json({ message: "Review updated", reviews: book.reviews });
  } else {
    // Add new review for this user
    book.reviews.push({ username: username, review: reviewText });
    return res.status(200).json({ message: "Review added", reviews: book.reviews });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
