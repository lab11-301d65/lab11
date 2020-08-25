//================================================== Packages =============================================================
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');

//================================================== Global Vars ==========================================================
const PORT = process.env.PORT || 3003;
const app = express();
app.use(express.static('./public'));

//================================================== Routes ===============================================================
app.set('view engine', 'ejs');
app.get('/', usersToSearch);


//================================================== Route Handlers =======================================================
app.get('/searches', masterGoogleSort);


//================================================== Functions ============================================================
function renderIndex (req, res){
  console.log('this is working');
  res.render('index');
}

function usersToSearch (req,res){
  res.render('new');

}

// handle in one function call
// if second value is author send ---> author URL
// conditional statement to determine which URL to use

function masterGoogleSort (req,res){
  console.log('from master Google Sort: ' , req.query);

}





function getBookByAuthor (req,res){
  let searchAuthor = req.query.author;

  const urlAuthor = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${searchAuthor}`;

  superagent.get(urlAuthor)
    .then(bookData => {
      console.log(bookData.body);
    });

}

function getBookByTitle (req,res){
  let searchTitle = req.query.title;
  const urlTitle = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${searchTitle}`;

  superagent.get(urlTitle)
    .then(bookData => {
      console.log(bookData.body);
    });


}

function getBookBySubject (req,res){
  let searchSubject = req.query.subject;
  const urlSubject = `https://www.googleapis.com/books/v1/volumes?q=+subject:${searchSubject}`;

  superagent.get(urlSubject)
    .then(bookData => {
      console.log(bookData.items.volumeInfo);
    });

}



function Book (bookJsonData){
  this.title = bookJsonData.title;
  this.author = bookJsonData.authors;
  this.description = bookJsonData.description;
  this.img = bookJsonData.imageLinks.smallThumbnail;
}

//================================================== Start the server =====================================================
app.listen(PORT, () => console.log(`We are doing it live on ${PORT}`));

