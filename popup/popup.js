let username = "";
const sendMessage = () => {
  console.log(input.value);
  if (false)
    browser.runtime.sendMessage({msg: 'start', username: 'qzim'});
};

const input = document.querySelector('input');
input.onkeyup = e => {
  if(e.keyCode === 13)
    sendMessage()
};
/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
const button = document.querySelector('button');
button.onclick = () => sendMessage();
/*document.addEventListener("click", (e) => {
  //there's literally just one button
  console.log(input.value);
  if(false)
    browser.runtime.sendMessage({msg: 'start', username: 'qzim'});
});*/
