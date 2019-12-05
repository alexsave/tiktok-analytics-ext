let map = {};

function listener(details) {
  let filter = browser.webRequest.filterResponseData(details.requestId);
  let decoder = new TextDecoder("utf-8");
  let encoder = new TextEncoder();
  let data = "";

  filter.ondata = event => {
    let str = decoder.decode(event.data, {stream: true});
    //console.log(str);
    data += str;
    //let data = JSON.parse(str);
    //console.log(data);
    
    filter.write(encoder.encode(str));
  }

  filter.onstop = event => {
    filter.disconnect();
    let obj = JSON.parse(data);
    //console.log(obj.body);
    
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
    console.log(map);
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["*://*.tiktok.com/share*"]},
  ["blocking"]
);

