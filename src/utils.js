let validateMessage = (e) => {
  let k = String.fromCharCode(e.which);

  if (k.match(/[^a-zA-Z0-9.,?!:'" ]/g))
    e.preventDefault();

  if (e.keyCode === 13)
    $("#send-btn").click();
};

let validateUsername = (e) => {
  let k = String.fromCharCode(e.which);

  if (k.match(/[^a-zA-Z0-9]/g))
    e.preventDefault();

  if (e.keyCode === 13)
    $("#login-btn").click();
};
