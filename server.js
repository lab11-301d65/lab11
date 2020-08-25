//================================================== Packages =============================================================

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const { response } = require('express');

//================================================== Global Vars ==========================================================

const PORT = process.env.PORT || 3003;
const app = express();

app.use(express.static('./public'));
app.use(cors());

//================================================== Routes ===============================================================
app.set('view engine', 'ejs');
app.get('/', masterGoogleSorter);


//================================================== Functions ============================================================
function masterGoogleSorter (req,res){
  res.render('new');

  if (req.query.userSearch[1] === 'Author'){
    console.log('you found an author ' + req.query.userSearch[0]);

    let searchAuthor = req.query.userSearch[0];
    const urlAuthor = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${searchAuthor}`;

    superagent.get(urlAuthor)
      .then(bookData => {
        const books = bookData.body.items;

        console.log(books.map(construct => new Book(construct)));
      })
      .catch(error => console.log(error));


  } else if (req.query.userSearch[1] === 'Title'){
    console.log('you found a title ' + req.query.userSearch[0]);

    let searchTitle = req.query.userSearch[0];
    const urlTitle = `https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTitle}`;

    superagent.get(urlTitle)
      .then(bookData => {
        console.log(bookData.body.items);
      });


  } else if (req.query.userSearch[1] === 'Subject'){
    console.log('you found a subject ' + req.query.userSearch[0]);

    let searchSubject = req.query.userSearch[0];
    const urlSubject = `https://www.googleapis.com/books/v1/volumes?q=subject:${searchSubject}`;

    superagent.get(urlSubject)
      .then(bookData => {
        console.log(bookData.body.items);
      });
  }
}


//================================================== Constructor ============================================================


function Book (bookJsonData){
  this.title = bookJsonData.volumeInfo.title;
  this.author = bookJsonData.volumeInfo.authors;
  this.description = bookJsonData.volumeInfo.description;

  if (bookJsonData.volumeInfo.previewLink === null){
    this.img = `https://i.imgur.com/J5LVHEL.jpg`;
  } else {
    this.img = bookJsonData.volumeInfo.previewLink;
  }

}

//================================================== Start the server =====================================================
app.listen(PORT, () => console.log(`We are doing it live on ${PORT}`));

