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

app.get('/views/pages/searches', masterGoogleSorter);

//================================================== Functions ============================================================
function renderIndex (req,res){
  res.render('index');
}

function masterGoogleSorter (req,res){
  res.render('pages/searches/new.ejs');

  let userRadioButton = req.query.userSearch[1];
  let userFormText = req.query.userSearch[0];
  let authorQuery = 'inauthor';
  let titleQuery = 'intitle';
  let subjectQuery = 'subject';
  let query = '';

  let googleBooksUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}:${userFormText}` ;

  if (userRadioButton === 'Author'){
    query = authorQuery;
  } else if (userRadioButton === 'Title'){
    query = titleQuery;
  } else {
    query = subjectQuery;
  }

  console.log('QUERY: ', query);

  superagent.get(googleBooksUrl)
    .then(bookData => {
      const books = bookData.body.items;
      console.log('URL: ', googleBooksUrl);

      bookApiArray = books.map(construct => new Book (construct));
      console.log(bookApiArray);
    })
    .catch(error => console.log(error));
}

function renderBooks (req,res){

}

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

