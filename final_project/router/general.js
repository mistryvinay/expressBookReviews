const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books));
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  bookNumber = parseInt([req.params.isbn]);
  res.send(("Book details for ISBN "+req.params.isbn)+ JSON.stringify(books[bookNumber]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  author = req.params.author;
  matchingBooks = Object.values(books).filter(book => book.author === author);
  res.send("Book details for author " + author + ": " + JSON.stringify(matchingBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  title = req.params.title;
  matchingBooks = Object.values(books).filter(book => book.title === title);
  res.send("Book details for title " + title + ": " + JSON.stringify(matchingBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  bookNumber = parseInt([req.params.isbn]);
  res.send("Book review for ISBN " + bookNumber + ": " + JSON.stringify(books[bookNumber]));
});

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

public_users.get("/", function (req, res) {
  getBookList().then(
    (books) => res.send(JSON.stringify(books, null, 4)),
    (error) => res.send("rejected")
  );
});

function getFromISBN(isbn) {
  let curent_book = books[isbn];
  return new Promise((resolve, reject) => {
    if (curent_book) {
      resolve(curent_book);
    } else {
      reject("Cant find book with given ISBN number");
    }
  });
}

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn_number = req.params.isbn;
  getFromISBN(isbn_number).then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  );
});

function getFromAuthor(author) {
  let answer = [];
  return new Promise((resolve, reject) => {
    for (var isbn_number in books) {
      let current_book = books[isbn_number];
      if (current_book.author === author) {
        answer.push(current_book);
      }
    }
    resolve(answer);
  });
}

public_users.get("/author/:author", function (req, res) {
  const author_name = req.params.author;
  getFromAuthor(author_name).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

function getFromTitle(title) {
  let answer = [];
  return new Promise((resolve, reject) => {
    for (var isbn_number in books) {
      let current_book = books[isbn_number];
      if (current_book.title === title) {
        answer.push(current_book);
      }
    }
    resolve(answer);
  });
}

public_users.get("/title/:title", function (req, res) {
  const book_title = req.params.title;
  getFromTitle(book_title).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;
