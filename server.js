//================================================== Packages =============================================================
require('dotenv').config(); // allows server to understand we have a .env that holds secrets 
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
// const { response } = require('express');
const pg = require('pg')

//================================================== Global Vars ==========================================================
const PORT = process.env.PORT || 3002;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true})); // this is a bodyparser that breaks up form input and puts it into the req.body
app.use(cors()); 
 
app.set('view engine', 'ejs');
//================================================== Routes ===============================================================
app.get('/', renderHomePage);
app.get('/searches/new', renderNewEJS);
app.post('/searches', renderSearchPage);
app.get('/books/:id', getAllTasks);
app.post('/books', insertBooks);

//================================================== Functions ============================================================
function renderHomePage (req,res){
  client.query('SELECT * FROM book_saver')
  .then(resultFromSql => {
    res.render('pages/index', {books : resultFromSql.rows});
  });
}

function renderNewEJS (req, res){
  res.render('pages/searches/new.ejs');
}

function renderSearchPage (req,res){
  const inputText = req.body.userSearch;
  
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
      let bookApiArray = books.map(construct => new Book (construct))
      console.log(bookApiArray[0].img)
      res.render('pages/searches/show', {
        booksToFrontEnd : bookApiArray,
      })
    });
}

function getAllTasks(req, res){
  client.query('SELECT * FROM book_saver')
    .then(result => {
      let bookcounter = result.rows.length
      res.send('pages/index', {
        books: result.rows,
        numberOfBooksInDataBase : bookcounter
      });
    })
}

function insertBooks(req, res) {
  const {img_url, title, author, description, isbn, category} = JSON.parse(req.body.book);

  const SQL = `INSERT INTO books (img_url, title, author, description, isbn, category) VALUES ($1, $2, $3, $4, $5, $6)`;
  const arrayValues = [img_url, title, author, description, isbn, category];

  client.query(SQL, arrayValues)
    .then( () => {
      res.redirect('/');
  })
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
client.connect()
.then(() => {
  app.listen(PORT, () => console.log(`We are doing it live on ${PORT}`));
});