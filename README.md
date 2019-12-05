# tiktok-addon

This is a TikTok scraper addon for Firefox.

All info is saved to an object that maps usernames to info. It overwrites videos so that there are no duplicate videos for a user. It is only cleared when the browser is closed(?) or the extension reloaded.

The key intuition here is that by loading the page, TikTok reponds with a bunch of data
Reponses matching tiktok.com/share will respond with this format:
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

