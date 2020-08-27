//================================================== Packages =============================================================
require('dotenv').config(); // allows server to understand we have a .env that holds secrets 
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
// const { response } = require('express');
const pg = require('pg');
const { response } = require('express');
const methodOverride = require('method-override');

//================================================== Global Vars ==========================================================
const PORT = process.env.PORT || 3002;
const app = express();
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);

app.use(express.static('./public'));
app.use(express.urlencoded({extended: true})); 
app.use(cors()); 
app.use(methodOverride('_method'));
 
app.set('view engine', 'ejs');
//================================================== Routes ===============================================================
app.get('/', renderHomePage);
app.get('/searches/new', renderNewEJS);
app.post('/searches', renderSearchPage);
app.post('/books', insertBooks);

app.delete('/books/:id', deleteTask)
app.put('/books/:idPotato', updateTask);

//================================================== Functions ============================================================
function deleteTask(req, res){
  const {id} = req.params;
  const SQL = 'DELETE FROM book_saver WHERE id=$1'
  client.query(SQL, [id])
  .then(() => {
    res.redirect('/')
  })
}

function updateTask(req, res){
  const SQL = `UPDATE book_saver SET 
                title = $1,
                author = $2, 
                description = $3,
                image_url = $4, 
                isbn = $5 WHERE id=$6`
  const values = [req.body.title, req.body.author, req.body.description, req.body.img, req.body.isbn, req.params.idPotato]
  console.log(values)
  client.query(SQL, values)
  .then(() => {
    res.redirect('/')
  })
  .catch(console.log)
}

function renderHomePage (req,res){
  client.query('SELECT * FROM book_saver')
    .then(result => {
      let bookcounter = result.rows.length
      res.render('pages/index', {
        books: result.rows,
        numberOfBooksInDataBase : bookcounter
      });
    })
}

function renderNewEJS (req, res){
  res.render('pages/searches/new');
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


function insertBooks(req, res) {
  const {img, title, author, description, isbn, category} = req.body;
  console.log(' we are on line' , req.body);
  const SQL = `INSERT INTO book_saver (image_url, title, author, description, isbn, category) VALUES ($1, $2, $3, $4, $5, $6)`;
  const arrayValues = [img, title, author, description.slice(0, 200), isbn, category];

  client.query(SQL, arrayValues)
    .then( () => {
      res.redirect('/');
  });
}


//================================================== Constructor ============================================================
function Book (bookJsonData){
  console.log(bookJsonData.volumeInfo)
  this.title = bookJsonData.volumeInfo.title;
  this.author = bookJsonData.volumeInfo.authors;
  this.description = bookJsonData.volumeInfo.description;
  this.isbn = `${bookJsonData.volumeInfo.industryIdentifiers[0].type} ${bookJsonData.volumeInfo.industryIdentifiers[0].identifier}`;
  let imgCheck = bookJsonData.volumeInfo.imageLinks.smallThumbnail;

  if (imgCheck === undefined){
    this.img = `https://i.imgur.com/J5LVHEL.jpg`;
  } else {
    let imgUrl = bookJsonData.volumeInfo.imageLinks.smallThumbnail;
    this.img = imgUrl;
  }
}

//================================================== Start the server =====================================================
client.connect()
.then(() => {
  app.listen(PORT, () => console.log(`We are doing it live on ${PORT}`));
});