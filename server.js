'use strict';
//================================================== Packages =============================================================

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const ejs = require('ejs');
const { response } = require('express');

//================================================== Global Vars ==========================================================

const PORT = process.env.PORT || 3003;
const app = express();
let bookApiArray = [];

app.use(express.static('./public'));
app.use(cors());

//================================================== Routes ===============================================================
app.set('view engine', 'ejs');
app.get('/', renderIndex);

// renders search page
// app.get('/views/pages/searches', renderSearchPage);

app.get('/views/pages/searches', masterGoogleSorter);

// TODO: POST call once user hits submit button
// app.post('/views/pages/searches', masterGoogleSorter);

//================================================== Functions ============================================================
function renderIndex (req,res){
  res.render('./pages/index');
}

function renderSearchPage (req,res){
  res.render('pages/searches/new.ejs');
}

// TODO: fix render show page function
// ERR: HTTP HEADERS SENT
function renderShowPage (req,res){
  res.render('pages/searches/show', {});
}


// TODO: the whole route handler POST request thing --> route is working but I can't find the req.query.userSearch values in the new POST info

function masterGoogleSorter (req,res){
  res.render('pages/searches/new.ejs');

  console.log('POST REQUEST WORKING');
  console.log(req);

  let userRadioButton = req.query.userSearch[1];
  let userFormText = req.query.userSearch[0];
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

  // console.log('QUERY: ', queryParameter);
  superagent.get(googleBooksUrl)
    .then(bookData => {
      const books = bookData.body.items;
      console.log('URL: ', googleBooksUrl);

      bookApiArray = books.map(construct => new Book (construct));
      console.log('CONSTRUCTED BOOK DATA: ', bookApiArray);
    })
    .then(res.render('./searches/show', {key : bookApiArray})) // TODO: fix render show page function
    .catch(error => console.log(error));
}

//  TODO: render API results to page


//================================================== Constructor ============================================================


function Book (bookJsonData){
  this.title = bookJsonData.volumeInfo.title;
  this.author = bookJsonData.volumeInfo.authors;
  this.description = bookJsonData.volumeInfo.description;

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

