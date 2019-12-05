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
    console.log(obj);
  }

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["*://*.tiktok.com/share*"]},
  ["blocking"]
);

