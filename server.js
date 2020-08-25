//================================================== Packages =============================================================
const express = require('express');
// const cors = require('cors');
const superagent = require('superagent');

//================================================== Global Vars ==========================================================
const PORT = process.env.PORT || 3003;
const app = express();
app.use(express.static('./public'));

//================================================== Routes ===============================================================
app.set('view engine', 'ejs');
app.get('/', masterGoogleSorter);


//================================================== Functions ============================================================
function masterGoogleSorter (req,res){
  res.render('new');

  if(req.query.userSearch[1] === 'Author'){
    console.log('you found an author ' + req.query.userSearch[0])

    let searchSubject = req.query.userSearch[0];
    const urlSubject = `https://www.googleapis.com/books/v1/volumes?q=+subject:${searchSubject}`;
  
    superagent.get(urlSubject)
      .then(bookData => {
        console.log(bookData.items.volumeInfo);
      });


  }else if(req.query.userSearch[1] === 'Title'){
    console.log('you found a title ' + req.query.userSearch[0])

    let searchTitle = req.query.userSearch[0];
    const urlTitle = `https://www.googleapis.com/books/v1/volumes?q=+intitle:${searchTitle}`;
  
    superagent.get(urlTitle)
      .then(bookData => {
        console.log(bookData.body);
    });


  }else if(req.query.userSearch[1] === 'Subject'){
    console.log('you found a subject ' + req.query.userSearch[0])

    let searchAuthor = req.query.userSearch[0];
    const urlAuthor = `https://www.googleapis.com/books/v1/volumes?q=+inauthor:${searchAuthor}`;
  
    superagent.get(urlAuthor)
      .then(bookData => {
        console.log(bookData);
    });
  }
}

// handle in one function call
// if second value is author send ---> author URL
// conditional statement to determine which URL to use

function Book (bookJsonData){
  this.title = bookJsonData.title;
  this.author = bookJsonData.authors;
  this.description = bookJsonData.description;
  this.img = bookJsonData.imageLinks.smallThumbnail;
}

//================================================== Start the server =====================================================
app.listen(PORT, () => console.log(`We are doing it live on ${PORT}`));

