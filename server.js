'use strict';
//================================================== Packages =============================================================

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');
const { response } = require('express');

//================================================== Global Vars ==========================================================

const PORT = process.env.PORT || 3002;
const app = express();
let bookApiArray = [];

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true})); // this is a bodyparser that breaks up form input and puts it into the req.body
app.use(cors());

//================================================== Routes ===============================================================
app.set('view engine', 'ejs');
app.get('/', renderHomePage);
app.get('/views/pages/searches', renderNewEJS);
app.post('/views/pages/searches', renderSearchPage);


//single book route
app.get('/books/:id', oneBookFromDatabase);

//================================================== Functions ============================================================
function renderHomePage (req,res){
  res.render('index');
}

// pg start
// databasename matches new database

function renderNewEJS (req, res){
  res.render('pages/searches/new.ejs');
}


//this needs to be its own function, having a render it it has it return just the render, then do nothing after
function renderSearchPage (req,res){
  const inputText = req.body.userSearch;
  console.log(inputText);

  let userRadioButton = inputText[1];
  let userFormText = inputText[0];
  let authorQuery = 'inauthor';
  let titleQuery = 'intitle';
  let subjectQuery = 'subject';
  let queryParameter = '';

  let googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${queryParameter}:${userFormText}` ;

  if (userRadioButton === 'Author'){
    queryParameter = authorQuery;
  } else if (userRadioButton === 'Title'){
    queryParameter = titleQuery;
  } else {
    queryParameter = subjectQuery;
  }

  superagent.get(googleBooksUrl)
    .then(bookData => {
      const books = bookData.body.items;
      bookApiArray = books.map(construct => new Book (construct));
      res.render('pages/searches/show.ejs', {
        booksToFrontEnd : bookApiArray
      });
    })
    .catch(error => errorHandler(error, res));
}

function errorHandler (error, res){
  res.render('pages/error.ejs', {error});
}


// TODO:
function oneBookFromDatabase (req,res){
  // make request for single book from database that returns the details
  // of the book

  client.query('SELECT * FROM todos WHERE id=$1' [request.params.potatoId])
    // .then (result => {
    //   response.render('/pages/books/detail.ejs' {task : result.rows[0]})
    // })
    .catch(error => errorHandler(error,res));
}


//================================================== Constructor ============================================================
function Book (bookJsonData){
  this.title = bookJsonData.volumeInfo.title;
  this.author = bookJsonData.volumeInfo.authors;
  this.description = bookJsonData.volumeInfo.description;
  this.isbn = 0;

  let imgCheck = bookJsonData.volumeInfo.imageLinks;

  if (imgCheck === undefined){
    this.img = `https://i.imgur.com/J5LVHEL.jpg`;
  } else {
    let imgKey = Object.keys(bookJsonData.volumeInfo.imageLinks)[1];
    let imgUrl = bookJsonData.volumeInfo.imageLinks[imgKey];
    this.img = imgUrl;
  }
}

//================================================== Start the server =====================================================
app.listen(PORT, () => console.log(`We are doing it live on ${PORT}`));

