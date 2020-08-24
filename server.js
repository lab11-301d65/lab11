//================================================== Packages =============================================================
const express = require('express');
// const cors = require('cors');
// const superagent = require('superagent');

//================================================== Global Vars ==========================================================
const PORT = process.env.PORT || 3003;
const app = express();
app.use(express.static('./public'));

//================================================== Routes ===============================================================
app.set('view engine', 'ejs');
app.get('/', noNameFunction);
app.get('/searches/new', usersToSearch)

//================================================== Route Handlers =======================================================


//================================================== Functions ============================================================
function noNameFunction(req, res){
  console.log('this is working');
  res.render('index');
}



//================================================== Start the server =====================================================
app.listen(PORT, () => console.log(`We are doing it live on ${PORT}`));