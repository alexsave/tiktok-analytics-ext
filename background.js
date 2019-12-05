const map = {};

//find the tiktok tab and send it a message
function sendMessageToTab(msg){
    browser.tabs.query({url: "*://*.tiktok.com/*"})
        .then(tabs => 
                tabs.forEach(tab => 
                    browser.tabs.sendMessage(tab.id, {msg})
                    )
             );
}

function listener(details){
    const filter = browser.webRequest.filterResponseData(details.requestId);
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();
    let data = "";

    filter.ondata = event => {
        const str = decoder.decode(event.data, {stream: true});
        //console.log(str);
        data += str;
        //let data = JSON.parse(str);
        //console.log(data);

        filter.write(encoder.encode(str));
    }

    filter.onstop = event => {
        filter.disconnect();
        const obj = JSON.parse(data);
        //console.log(obj.body);

        if(obj.body.hasMore)
            sendMessageToTab('scroll');


        const items = obj.body.itemListData;
        const user = items[0].authorInfos.uniqueId;

        if(!map[user])
            map[user] = {};

        //each of these items has a itemInfos object that has
        //comment 
        //also has a authorInfos.uniqueId (ex. qzim) to be safe
        items.forEach(item => {
                let tempobject = item.itemInfos.text + ': ' + item.itemInfos.diggCount;
                //this will overwrite, but that's good as we prevent duplicates
                map[user][item.itemInfos.id] = tempobject;
                });
        if(!(obj.body.hasMore))
            console.log(map);
    }

    return {};
}

browser.webRequest.onBeforeRequest.addListener(
        listener,
        {urls: ["*://*.tiktok.com/share*"]},
        ["blocking"]
        );

