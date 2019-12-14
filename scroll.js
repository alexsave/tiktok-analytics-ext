browser.runtime.onMessage.addListener(request => {
    if(request.msg === 'scroll')
        window.scrollTo(0, document.body.scrollHeight);

    //when the window loads, we'll have some data available
    //this does work wiht private account btw
    else if(request.msg === 'userdata'){
        const elem = document.querySelector('#__NEXT_DATA__');
        if(elem === null)
            browser.runtime.sendMessage({userData:{}, type: 'userdata'});
        const raw = elem.innerHTML;
        const obj = JSON.parse(raw);
        const data = obj.props.pageProps.userData;
        if(data === undefined)
            browser.runtime.sendMessage({userData:{}, type: 'userdata'});
        const userData = {
            username: data.uniqueId,
            shares: data.digg,
            followers: data.fans,
            following: data.following,
            likes: data.heart,
            bio: data.signature,
            verified: data.verified,
            videos: data.video
        };

        browser.runtime.sendMessage({userData, type: 'userdata'});
    }
    return Promise.resolve({});
});
browser.runtime.sendMessage({type: 'tabready'});
