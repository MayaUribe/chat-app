let socket = io();
let idleTime = 0;

// Displays a message dynamically when user sends it
// or the first time the chat is opened
let displayMessage = (message, users) => {
  let date = formatDate(message.date);
  let user = findUser(message.username, users);

  if (user) {
    let fullMessage = '<div class="col-md-11 msg-container">';
    fullMessage += '<strong>' + message.username + ' on ' + date + ' wrote: </strong>';
    fullMessage += message.value;
    fullMessage += '</div>';
    fullMessage += '<a class="trash-icon" style="display: none" onclick="deleteMessage(\'' + message.id + '\')">';
    fullMessage += '<img src="/public/images/trash-32.png">';
    fullMessage += '</a>';

    $('#messages').append($('<li id="' + message.id + '" class="' + message.username + ' col-md-12">').html(fullMessage));
    setColor(message.username, user[0].color);
    enableDeletion(message);
  }
};

let findUser = (username, users) => {
  return users.filter(user => user.username === username);
};

let clearMessages = () => {
  $('#messages').html('');
};

let isMessageDeletable = (message) => {
  return moment(message.date).isAfter(moment().subtract(15, 'minutes'));
};

// Initializes the deletion of a message for the user
let enableDeletion = (message) => {
  let user = $('#username').val();
  let elementId = '#' + message.id;
  let isDeletable = isMessageDeletable(message);

  if ((user === message.username) && isDeletable) {
    $(document).on('mouseenter', elementId, function () {
      $(this).find('.trash-icon').show();
    }).on('mouseleave', elementId, function () {
      $(this).find('.trash-icon').hide();
    });
  }
};

// Set font color on chat start
let setColor = (username, hex) => {
  let user = $('#username').val();
  if (username === user) {
    $('#colorpicker').css('background-color', hex);
  }
  $('.' + username).css('color', hex);
};

let deleteMessage = (message) => {
  socket.emit('delete message', message);
};

let timerIncrement = (sock) => {
  idleTime = idleTime + 1;
  if (idleTime >= 5) { // 5 minutes
    window.close();
  }
};

$(function () {
  let username = $('#username').val();
  socket.emit('init', true);

  //Increment the idle time counter every minute.
  setInterval(timerIncrement, 60000); // 1 minute

  //Zero the idle timer on mouse movement.
  $(this).mousemove((e) => {
    idleTime = 0;
  });

  $(this).keypress((e) => {
    idleTime = 0;
  });

  // Set font color on user selection
  $('#colorpicker').colpick({
    color: '000000',
    onChange: (hsb, hex, rgb, el) => {
      $(el).css('background-color', '#' + hex);
    },
    onSubmit: (hsb, hex, rgb, el) => {
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
    let date = moment(new Date());

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

  $(window).bind("beforeunload", () => {
    socket.emit('leave', username);
  });

  socket.on('chat message', (message, users) => {
    displayMessage(message, users);
    gotoBottom();
  });

  socket.on('get messages', (messages, users) => {
    clearMessages();
    $(messages).each((index, message) => {
      displayMessage(message, users);
    });

    gotoBottom();
  });

  socket.on('disconnect',function(){
    window.close();
  });
});
