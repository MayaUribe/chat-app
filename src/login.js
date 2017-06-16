// Opens the popup window with the chat
let openChatWindow = (userJoined) => {
  let username = $('#username');
  let url = '/chatroom/' + username.val();
  let title = 'Chat App';

  if (username.val() === userJoined) {
    $('#error-msg').hide();
    window.open(url, title, setWindowSize(800, 900));
    username.val('');
  }
};

$(function () {
  let socket = io();

  $('#login-btn').click(() => {
    let username = $('#username').val();

    if (username !== '') {
      socket.emit('join', { username });
    }
  });

  $('#login-form').submit(() => {
    event.preventDefault();
  });

  $('#username').keypress((e) => {
    validateUsername(e);
  });

  socket.on('user joined', (messages, userJoined, users) => {
    let username = $('#username').val();

    if (username === userJoined.username) {
      openChatWindow(userJoined.username);
    }
  });

  socket.on('already logged', function(user) {
    let username = $('#username').val();

    if (username === user[0].username) {
      if (user[0].logged) {
        $('#error-msg').show();
      } else {
        openChatWindow(user[0].username);
      }
    }
  });
});
