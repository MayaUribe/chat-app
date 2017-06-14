var express = require('express');
var router = express.Router();

router.get('/chatroom', function(req, res, next) {
  return res.render('chatroom', { title: 'Chat Room' });
});

// POST /login
router.post('/login', function(req, res, next) {
  console.log("username ====>", req.body.username);
  if (req.body.username) {
    console.log("*** Fine over here ***");
    //return res.redirect('/chatroom');
  } else {
    console.log("An error occurred");
  }
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
/*router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});*/

// GET /contact
/*router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});*/

module.exports = router;
