const tiktokStats = {};
let running = false;
let tiktokTab = -1;
let receivedResponse = false;

function stopListener(){
    if(tiktokTab !== -1)
        chrome.tabs.remove(tiktokTab);
    running = false;
    receivedResponse = false;
    tiktokTab = -1;
    chrome.webRequest.onBeforeRequest.removeListener(listener);
}

//find the tiktok tab and send it a message
function sendMessageToTab(msg){
    chrome.tabs.sendMessage(tiktokTab, {msg});
}

function saveToFile(){
    const blob = new Blob([JSON.stringify(tiktokStats)]);
    chrome.downloads.download({
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
    const filter = chrome.webRequest.filterResponseData(details.requestId);
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
        const user = items[0].authorInfos.uniqueId;

        if(!tiktokStats.hasOwnProperty(user))
            tiktokStats[user] = {};

        items.forEach(item => {
            const {id, text, createTime, diggCount, shareCount, commentCount} = item.itemInfos;
            const {musicId, musicName} = item.musicInfos;
            //Get rid of this character ’ !== '
            const cleanText = text.replace('’', '\'');
            tiktokStats[user][id] = {
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
            stopListener();
            saveToFile();
        }
    };

    return {};
}

chrome.runtime.onMessage.addListener(message => {
    if(!running){
        running = true;
        //receivedResponse = false;
        chrome.webRequest.onBeforeRequest.addListener(
          listener,
          {urls: ["*://*.tiktok.com/share*"]},
          ["blocking"]
        );

        //if we don't get a reponse that we need in 5s, the page must not work
        setTimeout(() => {
            if(!receivedResponse){
                //we'll save it anyways as empty
                tiktokStats[message.username] = {};
                stopListener();
            }
        }, 5000);

        if(message.reuseTab)
            chrome.tabs.reload(/*{bypassCache:true}*/);
        else{
            chrome.tabs.create({
                active: true,
                url: `https://www.tiktok.com/@${message.username}`
            }, tab => tiktokTab = tab.id);
        }
    }
    return Promise.resolve({});
});

