# tiktok-addon

Icons from: https://www.iconfinder.com/iconsets/free-retina-icon-set

This is a TikTok scraper addon for Firefox.

All info is saved to an object that maps usernames to info. It overwrites videos so that there are no duplicate videos for a user. It is only cleared when the browser is closed(?) or the extension reloaded.

Here's the flow of the program:
User clicks on the toolbar icon: that opens popup
The user provides a username in the popup. This is saved
The user presses enter or a button, and that starts up the request interceptor. 
Mozilla navigates to the users page, then we scrape until it says it's done. 
THe request interceptor is turned off

The key intuition here is that by loading the page, TikTok responds with a bunch of data
Responses matching tiktok.com/share will respond with this format:
body:{
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
}

