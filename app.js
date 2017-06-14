let express = require('express');
let app = express();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//app.use('/', express.static(__dirname + '/'));
app.use("/public", express.static(__dirname + '/public'));
app.use("/src", express.static(__dirname + '/src'));
app.use(express.static(__dirname + '/node_modules'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
