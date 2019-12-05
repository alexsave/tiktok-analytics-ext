function sendMessage(){
  browser.runtime.sendMessage({username: input.value});
}

const input = document.querySelector('input');
input.onkeyup = e => {
  if(e.keyCode === 13)
    sendMessage();
};
//Listen for clicks on the buttons, and send the appropriate message to
document.querySelector('button').onclick = sendMessage;
