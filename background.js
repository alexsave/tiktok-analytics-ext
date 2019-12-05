/*
    The key intuition here is that by loading the page, TikTok reponds with a bunch of data
    Reponses matching tiktok.com/share will respond with this format:
    body:
        hasMore: true,
        itemListData: [
            {
                authorInfos: {
                    nickName: "Rocket",
                    uniqueId: "qzim",
                    signature: "bio",
                    userId: "5456789876545678"
                },
                challengeInfoList: {
                    [
                        {
                            challengeName:"holidayhacks"
                        },
                        ...
                    ]
                },
                itemInfos: {
                    commentCount: 2,
                    createTime: 15345678986, 
                    diggCount: 2,
                    id: "456787654",
                    shareCount: 3,
                    text: "yada yada yada"
                    video: {urls: ["https://fdsafdsafds]}
                },
                musicInfos: {
                    authorName: "brianna.caston",
                    musicId: "4568765456",
                    musicName: "New Hampshire Check"
                },
            },
            ...
        ]
*/
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
    //each of these items has a itemInfos object that has
    //comment 
    //also has a autherInfos.uniqueId (ex. qzim) to be safe
    items.forEach(item => 
      console.log(item.itemInfos.text + ': ' + item.itemInfos.diggCount)
    );
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["*://*.tiktok.com/share*"]},
  ["blocking"]
);

