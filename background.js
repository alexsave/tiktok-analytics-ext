const tiktokStats = {};
let running = false;
let tiktokTab = -1;
let receivedResponse = false;

function stopListener(){
    if(tiktokTab !== -1)
        browser.tabs.remove(tiktokTab);
    running = false;
    receivedResponse = false;
    tiktokTab = -1;
    browser.webRequest.onBeforeRequest.removeListener(listener);
}

//find the tiktok tab and send it a message
function sendMessageToTab(msg){
    browser.tabs.sendMessage(tiktokTab, {msg});
}

function saveToFile(){
    const blob = new Blob([JSON.stringify(tiktokStats)]);
    browser.downloads.download({
        url: URL.createObjectURL(blob),
        saveAs: true,
        filename: 'tiktok-data.json'
    });
}

function listener(details){
    //sanity check
    if(!running)
        return;

    receivedResponse = true;
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();
    let data = "";

    filter.ondata = event => {
        const str = decoder.decode(event.data, {stream: true});
        data += str;

        filter.write(encoder.encode(str));
    };

    filter.onstop = () => {
        filter.disconnect();
        const obj = JSON.parse(data);

        //don't send it immediately because it may still be loading
        if(obj.body.hasMore)
            setTimeout(() => sendMessageToTab('scroll'), 500);

        const items = obj.body.itemListData;

        //will otherwise break the extension on users with no videos
        if(items.length === 0){
            sendMessageToTab('userdata');
            /*stopListener();
            saveToFile();*/
            return {};
        }

        const user = items[0].authorInfos.uniqueId;

        if(!tiktokStats.hasOwnProperty(user))
            tiktokStats[user] = {tiktoks:{}};

        items.forEach(item => {
            const {id, text, createTime, diggCount, shareCount, commentCount} = item.itemInfos;
            const {musicId, musicName} = item.musicInfos;
            //Get rid of this character ’ !== '
            const cleanText = text.replace('’', '\'');
            tiktokStats[user]['tiktoks'][id] = {
                text: cleanText,
                time: createTime,
                likes: diggCount,
                shares: shareCount,
                comments: commentCount,
                vidurl: item.itemInfos.video.urls[0],
                musicId,
                musicName,
                musicurl: item.musicInfos.playUrl[0]
            };
        });

        //finish scraping
        if(!(obj.body.hasMore)){

            sendMessageToTab('userdata');
            /*stopListener();
            saveToFile();*/
        }
    };

    return {};
}

browser.runtime.onMessage.addListener(message => {
    //request to scrape a user
    if(message.type === 'scrape'){

        if(!running){
            running = true;
            //receivedResponse = false;
            browser.webRequest.onBeforeRequest.addListener(
              listener,
              {urls: ["*://*.tiktok.com/share*"]},
              ["blocking"]
            );

            //if we don't get a reponse that we need in 5s, the page must not work
            setTimeout(() => {
                if(!receivedResponse){
                    //we'll save it anyways as empty
                    tiktokStats[message.username] = {tiktoks:{}};
                    sendMessageToTab('userdata');
                    //stopListener();
                }
            }, 9000);

            if(message.reuseTab)
                browser.tabs.reload(/*{bypassCache:true}*/);
            else{
                browser.tabs.create({
                    active: true,
                    url: `https://www.tiktok.com/@${message.username}`
                }).then(tab => tiktokTab = tab.id);
            }
        }
    }
    //return of user specific data
    else if(message.type === 'userdata'){
        if(message.userData.username){
            const user = message.userData.username;
            //idk how this would be possible but just in case
            if(!tiktokStats.hasOwnProperty(user))
                tiktokStats[user] = {};
            tiktokStats[user] = {...tiktokStats[user], ...message.userData};
        }
        //we're gonna do this here because the userdata message is the last thing that will happen
        stopListener();
        saveToFile();
    }
    return Promise.resolve({});
});

