let tabU = '';
function sendMessage(){
    chrome.runtime.sendMessage({reuseTab: tabU === input.value, username: input.value});
    window.close();
}

const input = document.querySelector('input');
input.focus();
input.onkeyup = e => {
    if(e.keyCode === 13)
        sendMessage();
};

//Listen for clicks on the buttons, and send the appropriate message to
document.querySelector('button').onclick = sendMessage;

function analyzeTabs(tabs){
    if(tabs.length !== 0){
        tabU = tabs[0].url.split('@')[1];
        input.value = tabU;
    }
};
//see if we're already on a tiktok user page that they probably want to scrape
chrome.tabs.query({url: '*://*.tiktok.com/@*', currentWindow: true, active: true}, analyzeTabs);
