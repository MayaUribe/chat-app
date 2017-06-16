let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');
let messages = [];
let users = [];

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/public", express.static(__dirname + '/public'));
app.use("/src", express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/node_modules'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
let routes = require('./routes/index');
app.use('/', routes);

let setUserLogged = (users, user, isLogged) => {
  for (let i in users) {
    if (user === users[i].username) {
      users[i].logged = isLogged;
      break;
    }
  }
};

io.on('connection', (socket) => {
  socket.on('join', (data) => {
    let username = data.username;
    let user = users.filter(user => user.username === username);

    if (user.length > 0) {
      io.emit('already logged', user);
      if (!user.logged) { // the user logged back in
        setUserLogged(users, data.username, true);
      }
    } else { // the user logged in
      let user = {
        logged: true,
        username,
        color: '#000000'
      };
      users.push(user);
      socket.join(user);
      io.emit('user joined', messages, user, users);
    }
  });

  socket.on('get messages', (messages) => {
    io.emit('get messages', messages, users);
  });

  socket.on('init', (init) => {
    io.emit('init', init);
    io.emit('get messages', messages, users);
  });

  socket.on('leave', (username) => {
    setUserLogged(users, username, false);
    io.emit('leave', username);
  });

  socket.on('chat message', (message) => {
    messages.push(message);
    io.emit('chat message', message, users);
  });

  socket.on('already logged', (user) => {
    io.emit('already logged', user);
  });

  socket.on('change color', (username, color) => {
    for (let i in users) {
      if (users[i].username === username) {
        users[i].color = color;
        break;
      }
    }
    socket.emit('change color', username, color);
  });

  socket.on('delete message', (message) => {
    let index = messages.findIndex(msg => msg.id === parseInt(message));

    if (index !== -1) {
      messages.splice(index, 1);
      io.emit('delete message', message);
      io.emit('get messages', messages, users);
    }
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});
