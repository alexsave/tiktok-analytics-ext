/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
document.addEventListener("click", (e) => {
  //there's literally just one button
  console.log('username');
  if(false)
    browser.runtime.sendMessage({msg: 'start', username: 'qzim'});
});
