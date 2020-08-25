//================================================== Packages =============================================================

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const { response } = require('express');

//================================================== Global Vars ==========================================================

const PORT = process.env.PORT || 3003;
const app = express();
let bookApiArray = [];

app.use(express.static('./public'));
app.use(cors());

//================================================== Routes ===============================================================
app.set('view engine', 'ejs');
app.get('/', masterGoogleSorter);


//================================================== Functions ============================================================
function masterGoogleSorter (req,res){
  res.render('new');

  if (req.query.userSearch[1] === 'Author'){
    // console.log('you found an author ' + req.query.userSearch[0]);

    let searchAuthor = req.query.userSearch[0];
    const urlAuthor = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${searchAuthor}`;

    superagent.get(urlAuthor)
      .then(bookData => {
        const books = bookData.body.items;

        bookApiArray = books.map(construct => new Book(construct));
        console.log(bookApiArray);
      })
      .catch(error => console.log(error));


  } else if (req.query.userSearch[1] === 'Title'){
    // console.log('you found a title ' + req.query.userSearch[0]);

    let searchTitle = req.query.userSearch[0];
    const urlTitle = `https://www.googleapis.com/books/v1/volumes?q=intitle:${searchTitle}`;

    superagent.get(urlTitle)
      .then(bookData => {
        const books = bookData.body.items;

        bookApiArray = books.map(construct => new Book(construct));
        console.log(bookApiArray);

      });


  } else if (req.query.userSearch[1] === 'Subject'){
    // console.log('you found a subject ' + req.query.userSearch[0]);

    let searchSubject = req.query.userSearch[0];
    const urlSubject = `https://www.googleapis.com/books/v1/volumes?q=subject:${searchSubject}`;

    superagent.get(urlSubject)
      .then(bookData => {
        const books = bookData.body.items;

        bookApiArray = books.map(construct => new Book(construct));
        console.log(bookApiArray);

      });
  }
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

