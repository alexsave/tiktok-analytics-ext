browser.runtime.onMessage.addListener(request => {
    if(request.msg === 'scroll'){
        window.scrollTo(0, document.body.scrollHeight);
    }
    return Promise.resolve({});
});
