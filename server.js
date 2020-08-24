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
// app.get('/', renderIndex);
app.get('/', usersToSearch);

//================================================== Route Handlers =======================================================


//================================================== Functions ============================================================
function renderIndex(req, res){
  console.log('this is working');
  res.render('index');
}

function usersToSearch (req,res){
  console.log(req.query);
  res.render('new');
}

//================================================== Start the server =====================================================
app.listen(PORT, () => console.log(`We are doing it live on ${PORT}`));

