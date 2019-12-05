browser.runtime.onMessage.addListener(request => {
    if(request.msg === 'scroll')
        console.log(request.msg);
    return Promise.resolve({});
});
//window.scrollTo(0, document.body.scrollHeight)
