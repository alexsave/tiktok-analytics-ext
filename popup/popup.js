function sendMessage(){
  browser.runtime.sendMessage({username: input.value});
  window.close();
}

const input = document.querySelector('input');
input.onkeyup = e => {
  if(e.keyCode === 13)
    sendMessage();
};
//Listen for clicks on the buttons, and send the appropriate message to
document.querySelector('button').onclick = sendMessage;

//see if we're already on a tiktok user page that they probably want to scrape
browser.tabs.query({url: '*://*.tiktok.com/@*'})
    .then(tabs => {
        if(tabs.length !== 0)
            console.log(tabs[0].url);
    });
