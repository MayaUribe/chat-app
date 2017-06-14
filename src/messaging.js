let getWindowSize = () => {
  let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

  let left = (screen.width/2)-(width/2);
  let top = (screen.height/2)-(height/2);

  return 'width=800, height=900, left=' + left + ', top=' + top;
};

$(function () {
  let socket = io();

  $('#login-form').submit(() => {
    let url = 'chatroom';
    let title = 'Chat App';

    window.open(url, title, getWindowSize());

    event.preventDefault();
});

  $('#messaging-form').submit(() => {
    let message = $('#message');
    socket.emit('chat message', message.val());
    message.val('');
    return false;
  });

  socket.on('chat message', (msg) => {
    $('#messages').append($('<li>').text(msg));
  });
});
