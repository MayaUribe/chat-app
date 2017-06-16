let express = require('express');
let router = express.Router();

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// POST /login
router.post('/login', function(req, res, next) {
  if (req.body.username) {
    return res.redirect('/chatroom/' + req.body.username);
  } else {
    console.log("An error occurred");
  }
});

// GET /logout
router.get('/logout', function(req, res, next) {
  return res.redirect('/');
});

// GET /chatroom/:username
router.get('/chatroom/:username', function(req, res, next) {
  let username = req.params.username;
  return res.render('chatroom', { title: 'Chat Room', username: username });
});

// GET /chatroom/
router.get('/chatroom', function(req, res, next) {
  return res.render('chatroom', { title: 'Chat Room' });
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
