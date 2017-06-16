/*
  Utilities methods used in all app
 */

// String format validation for messages
let validateMessage = (e) => {
  let k = String.fromCharCode(e.which);

  if (k.match(/[^a-zA-Z0-9.,?!:'" ]/g))
    e.preventDefault();

  if (e.keyCode === 13)
    $('#send-btn').click();
};

// String format validation for username
let validateUsername = (e) => {
  let k = String.fromCharCode(e.which);

  if (k.match(/[^a-zA-Z0-9]/g))
    e.preventDefault();

  if (e.keyCode === 13)
    $('#login-btn').click();
};

// Format date
let formatDate = (date) => {
  return moment(date).format('MM/DD/YY HH:MM');
};

// Scroll to the bottom of the chat
let gotoBottom = () => {
  let d = $('#messages');
  d.scrollTop(d.prop("scrollHeight"));
};

// Set chat window size
let setWindowSize = (w, h) => {
  let left = (screen.width / 2) - (w / 2);
  let top = (screen.height / 2) - (h / 2);

  return 'width=' + w + ', height=' + h + ', left=' + left + ', top=' + top;
};
