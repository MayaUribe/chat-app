let displayMessage = (message, users) => {
  let user = findUser(message.username, users);
  let color = user[0].color;
  let fullMessage = '<strong>' + message.username + ' on ' + message.date + ' wrote: </strong>' + message.value;
  $('#messages').append($('<li class="' + message.username + '">').html(fullMessage));
  setColor(message.username, color);
};

let findUser = (username, users) => {
  return users.filter(user => user.username === username);
};

let clearMessages = () => {
  $('#messages').html('');
};

let setColor = (username, hex) => {
  let user = $('#username').val();
  if (username === user) {
    $('#colorpicker').css('background-color', hex);
  }
  $('.' + username).css('color', hex);
};

$(function () {
  let socket = io();
  let username = $('#username').val();

  socket.emit('init', true);

  $('#colorpicker').colpick({
    color: '000000',
    onChange: function(hsb, hex, rgb, el) {
      $(el).css('background-color', '#' + hex);
    },
    onSubmit: function(hsb, hex, rgb, el) {
      $(el).css('background-color', '#' + hex);
      $('.' + username).css('color', '#' + hex);
      $(el).colpickHide();
      socket.emit('change color', username, '#' + hex);
    }
  });

  $('#message').keypress((e) => {
    validateMessage(e);
  });

  $('#messaging-form').submit(() => {
    let messageText = $('#message');
    let username = $('#username');
    let date = moment(new Date()).format('MMMM Do YYYY HH:MM');

    let message = {
      id: new Date().valueOf(),
      value: messageText.val(),
      username: username.val(),
      date
    };

    socket.emit('chat message', message);
    messageText.val('');
    return false;
  });

  $('#logout-btn').click(() => {
    socket.emit('leave', username);
    window.close();
  });

  $(window).bind("beforeunload", function() {
    socket.emit('leave', username);
    //return confirm("Do you really want to close?");
  });

  socket.on('chat message', (message, users) => {
    displayMessage(message, users);
  });

  socket.on('get messages', function(messages, users) {
    clearMessages();
    $(messages).each((index, message) => {
      displayMessage(message, users);
    });
  });
});
