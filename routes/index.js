let express = require('express');
let router = express.Router();

// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});

// POST /login
router.post('/login', (req, res, next) => {
  if (req.body.username) {
    return res.redirect('/chatroom/' + req.body.username);
  } else {
    console.log("An error occurred");
  }
});

// GET /logout
router.get('/logout', (req, res, next) => {
  return res.redirect('/');
});

// GET /chatroom/:username
router.get('/chatroom/:username', (req, res, next) => {
  let username = req.params.username;
  return res.render('chatroom', { title: 'Chat Room', username: username });
});

// GET /chatroom/
router.get('/chatroom', (req, res, next) => {
  return res.render('chatroom', { title: 'Chat Room' });
});

module.exports = router;
