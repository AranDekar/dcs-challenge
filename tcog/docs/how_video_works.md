# How Video Works

## How Video Categories Work

The video categories live in https://docs.google.com/spreadsheets/d/1bt6ve_qZUQmpFoQNxoHV5RQW0KIdkZy2gRIKPP4Yhp4/edit

They have the fields:

- `parent_name`
- `child_name`
- `position`
- `value`
- `id`
- `whitelist`

Whitelist is the domain hostnames that the site should run on. It can also be special values `metros` or `regionals` which will be transformed to all the metros and regionals, except for `WeeklyTimesNow` which must be manually included in the whitelist. You can have as many whitelist columns as you want.

To download, go to `File -> Download as -> Tabbed Seperated Values`, put the downloaded file as `./conf/video/merged.tsv`. Then run `node ./conf/video.js` to generate the `./conf/video/merged.json` file from it. The conversion script will do the necessary transformations to the codebase.

The JSON file is then used the video transformer at `./transformers/video/`.


## How the Video Pipeline Works

### summary

Views:

`router.jade` calls `video.jade`, `banner.jade`, `module.jade`, `index.jade`

`video.jade` calls `index.jade`

`index.jade` calls `module.jade`

`module.jade` calls  `list-header.jade`


Playlists:

`playlist-pre-flight.jade` calls `playlist.jade`

`playlist.jade`, `list-header.jade`, `player.jade`, `page-header.jade`, `banner.jade` call nothing


Path variable:

`path` => `video.jade` => `index.jade` => `module.jade` => `list-header.jade`



### video id routes

We start off with a URL like so (note that this URL may not work as time passes, as it may be deleted or the like, in which case just find a new video url):

http://www.news.com.au/video/id-5348771529001-5470to343978001/Pacemaker-s-800m-final-fail

This is then somehow sent to the `transformers/component/video` transformer that handlers the route `http://localhost:3000/component/video` and the template `views/video/router.jade`.

The `router.jade` then tests the URL it was loaded from against the possible routes it could be. For our given URL, it will run this part of the template logic:

``` jade
    esi:when(test="$(AKA_PM_FWD_URL) matches_i '''^/video/id-([0-9]+[-][0-9]+)'''", matchname="pathvars")
        +esiDcaTry("/news/content/v2/origin:brightcove.$(pathvars{1})?domain=$(HOSTNAME)&t_product=" + product.name + "&t_template=../video/video")
```

The first `esi` handler will hit the agent middleware for:

http://localhost:3000/news/content/v2/origin:brightcove.5348771529001-5470343978001?domain=news.com.au&t_product=video&t_template=../video/video

Which provides the following json data:

http://localhost:3000/news/content/v2/origin:brightcove.5348771529001-5470343978001?domain=news.com.au&t_product=video&t_output=json

``` json
{
    "display": {
        "site": "news.com.au"
    },
    "data": {
        "contentType": "VIDEO",
        "id": {
            "value": "6ec2bad31de3f2713c9cdd91f72e7435",
            "link": "http://cdn.newsapi.com.au/content/v2/6ec2bad31de3f2713c9cdd91f72e7435"
        },
        "originId": "5348771529001-5470343978001",
        "origin": "BRIGHTCOVE",
        "title": "Pacemaker's 800m final fail",
        "subtitle": "Pacemaker's 800m final fail",
        "description": "Athletics: At the recent Diamond League meeting in Rome, Kenyan Job Kinyor had the role of pacemaker for the men's 800 metre final.",
        "link": "http://cdn.newsapi.com.au/link/6ec2bad31de3f2713c9cdd91f72e7435?domain=ntnews.com.au",
        "paidStatus": "NON_PREMIUM",
        "originalSource": "FOXSPORTS",
        "version": "PUBLISHED",
        "dateUpdated": "2017-06-14T04:37:12.000Z",
        "dateLive": "2017-06-14T04:37:00.000Z",
        "dateCreated": "2017-06-14T04:37:03.000Z",
        "status": "ACTIVE",
        "thumbnailImage": {
            "contentType": "IMAGE",
            "id": {
                "value": "f035eec8d9555c7cddcd2f5a7a43d159",
                "link": "http://cdn.newsapi.com.au/image/v1/f035eec8d9555c7cddcd2f5a7a43d159"
            },
            "originId": "5348771529001-5470343978001-thumbnail",
            "origin": "BRIGHTCOVE",
            "title": "Pacemaker's 800m final fail",
            "description": "Athletics: At the recent Diamond League meeting in Rome, Kenyan Job Kinyor had the role of pacemaker for the men's 800 metre final.",
            "link": "http://cdn.newsapi.com.au/image/v1/f035eec8d9555c7cddcd2f5a7a43d159",
            "paidStatus": "NON_PREMIUM",
            "originalSource": "FOXSPORTS",
            "version": "PUBLISHED",
            "dateUpdated": "2017-06-14T04:37:12.000Z",
            "dateLive": "2017-06-14T04:37:00.000Z",
            "dateCreated": "2017-06-14T04:37:03.000Z",
            "status": "ACTIVE",
            "related": [],
            "domainLinks": [],
            "categories": [],
            "keywords": [],
            "authors": [],
            "domains": [],
            "locationGeoPoints": [],
            "userOriginUpdated": "synchroniser",
            "systemOriginUpdated": "BRIGHTCOVE",
            "urlTitle": "pacemakers-800m-final-fail",
            "revision": 2,
            "format": "jpeg",
            "width": 160,
            "height": 90,
            "imageName": "5348771529001_5470342784001_5470343978001-th.jpg",
            "imageType": "THUMBNAIL",
            "sourceImageId": "5348771529001-5470343978001-source"
        },
        "related": [{
            "contentType": "IMAGE",
            "id": {
                "value": "c99610be9351a516d8f3cd51f09f2275",
                "link": "http://cdn.newsapi.com.au/image/v1/c99610be9351a516d8f3cd51f09f2275"
            },
            "originId": "5348771529001-5470343978001-poster",
            "origin": "BRIGHTCOVE",
            "title": "Pacemaker's 800m final fail",
            "subtitle": "Pacemaker's 800m final fail",
            "description": "Athletics: At the recent Diamond League meeting in Rome, Kenyan Job Kinyor had the role of pacemaker for the men's 800 metre final.",
            "link": "http://cdn.newsapi.com.au/image/v1/c99610be9351a516d8f3cd51f09f2275",
            "paidStatus": "NON_PREMIUM",
            "originalSource": "FOXSPORTS",
            "version": "PUBLISHED",
            "dateUpdated": "2017-06-14T04:37:12.000Z",
            "dateLive": "2017-06-14T04:37:00.000Z",
            "dateCreated": "2017-06-14T04:37:03.000Z",
            "status": "ACTIVE",
            "referenceType": "SECONDARY",
            "related": [],
            "domainLinks": [],
            "categories": [],
            "keywords": [],
            "authors": [],
            "domains": [],
            "locationGeoPoints": [],
            "userOriginUpdated": "synchroniser",
            "systemOriginUpdated": "BRIGHTCOVE",
            "urlTitle": "pacemakers-800m-final-fail",
            "revision": 2,
            "format": "jpeg",
            "width": 640,
            "height": 360,
            "imageName": "5348771529001_5470342786001_5470343978001-vs.jpg",
            "imageType": "HERO",
            "sourceImageId": "5348771529001-5470343978001-source"
        }],
        "domainLinks": [{
            "name": "cairnspost.com.au",
            "link": "http://www.cairnspost.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "ntnews.com.au",
            "link": "http://www.ntnews.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "goldcoastbulletin.com.au",
            "link": "http://www.goldcoastbulletin.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "couriermail.com.au",
            "link": "http://www.couriermail.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "themercury.com.au",
            "link": "http://www.themercury.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "heraldsun.com.au",
            "link": "http://www.heraldsun.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "adelaidenow.com.au",
            "link": "http://www.adelaidenow.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "news.com.au",
            "link": "http://www.news.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "townsvillebulletin.com.au",
            "link": "http://www.townsvillebulletin.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "perthnow.com.au",
            "link": "http://www.perthnow.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "dailytelegraph.com.au",
            "link": "http://www.dailytelegraph.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }, {
            "name": "geelongadvertiser.com.au",
            "link": "http://www.geelongadvertiser.com.au/video/id-5348771529001-5470343978001/pacemakers-800m-final-fail"
        }],
        "primaryCategory": {
            "value": "/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/More Sports/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/More%20Sports/",
            "id": "1226506797283",
            "isDominant": true
        },
        "categories": [{
            "value": "/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/More Sports/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/More%20Sports/",
            "id": "1226506797283",
            "isDominant": true
        }, {
            "value": "/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/",
            "id": "1226487037076"
        }, {
            "value": "/video/video.news.com.au/sourceId/628817/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/sourceId/628817/"
        }, {
            "value": "/display/couriermail.com.au/Sport news and galleries/More Sports/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Sport%20news%20and%20galleries/More%20Sports/",
            "id": "1226647102272",
            "isSyndicated": true
        }, {
            "value": "/display/adelaidenow.com.au/Sport news and galleries/More Sports/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Sport%20news%20and%20galleries/More%20Sports/",
            "id": "1226647102273",
            "isSyndicated": true
        }, {
            "value": "/display/dailytelegraph.com.au/Sport news and galleries/More Sports/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Sport%20news%20and%20galleries/More%20Sports/",
            "id": "1226620941433",
            "isSyndicated": true
        }, {
            "value": "/display/perthnow.com.au/Sport news and galleries/More Sports/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Sport%20news%20and%20galleries/More%20Sports/",
            "id": "1226600332559",
            "isSyndicated": true
        }, {
            "value": "/display/heraldsun.com.au/Sport news and galleries/More Sports/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Sport%20news%20and%20galleries/More%20Sports/",
            "id": "1226635880647",
            "isSyndicated": true
        }, {
            "value": "/display/news.com.au/Sport/More Sports/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/More%20Sports/",
            "id": "1226365869132",
            "isSyndicated": true
        }, {
            "value": "/display/adelaidenow.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/adelaidenow.com.au/Sport%20news%20and%20galleries/",
            "id": "1226633804010",
            "isSyndicated": true
        }, {
            "value": "/display/goldcoastbulletin.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/goldcoastbulletin.com.au/Sport%20news%20and%20galleries/",
            "id": "1227960774948",
            "isSyndicated": true
        }, {
            "value": "/display/dailytelegraph.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/dailytelegraph.com.au/Sport%20news%20and%20galleries/",
            "id": "1226620933253",
            "isSyndicated": true
        }, {
            "value": "/display/ntnews.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/ntnews.com.au/Sport%20news%20and%20galleries/",
            "id": "1227960774949",
            "isSyndicated": true
        }, {
            "value": "/display/perthnow.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/perthnow.com.au/Sport%20news%20and%20galleries/",
            "id": "1226600307173",
            "isSyndicated": true
        }, {
            "value": "/display/heraldsun.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/heraldsun.com.au/Sport%20news%20and%20galleries/",
            "id": "1226621617230",
            "isSyndicated": true
        }, {
            "value": "/display/townsvillebulletin.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/townsvillebulletin.com.au/Sport%20news%20and%20galleries/",
            "id": "1227974998773",
            "isSyndicated": true
        }, {
            "value": "/display/news.com.au/Sport/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/news.com.au/Sport/",
            "id": "1226177573029",
            "isSyndicated": true
        }, {
            "value": "/display/couriermail.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/couriermail.com.au/Sport%20news%20and%20galleries/",
            "id": "1226633804011",
            "isSyndicated": true
        }, {
            "value": "/display/themercury.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/themercury.com.au/Sport%20news%20and%20galleries/",
            "id": "1227796732399",
            "isSyndicated": true
        }, {
            "value": "/display/geelongadvertiser.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/geelongadvertiser.com.au/Sport%20news%20and%20galleries/",
            "id": "1227974998774",
            "isSyndicated": true
        }, {
            "value": "/display/cairnspost.com.au/Sport news and galleries/",
            "link": "http://cdn.newsapi.com.au/category/v2/display/cairnspost.com.au/Sport%20news%20and%20galleries/",
            "id": "1227974993877",
            "isSyndicated": true
        }],
        "keywords": [],
        "authors": [],
        "domains": ["ntnews.com.au", "cairnspost.com.au", "couriermail.com.au", "goldcoastbulletin.com.au", "adelaidenow.com.au", "heraldsun.com.au", "themercury.com.au", "news.com.au", "perthnow.com.au", "townsvillebulletin.com.au", "dailytelegraph.com.au", "geelongadvertiser.com.au"],
        "references": [{
            "id": {
                "value": "c99610be9351a516d8f3cd51f09f2275",
                "link": "http://cdn.newsapi.com.au/content/v2/c99610be9351a516d8f3cd51f09f2275"
            },
            "origin": "BRIGHTCOVE",
            "originId": "5348771529001-5470343978001-poster",
            "contentType": "IMAGE",
            "referenceType": "SECONDARY"
        }],
        "locationGeoPoints": [],
        "userOriginUpdated": "synchroniser",
        "systemOriginUpdated": "BRIGHTCOVE",
        "urlTitle": "pacemakers-800m-final-fail",
        "revision": 2,
        "expiryDate": "2017-06-21T04:21:27.000Z",
        "videoFiles": [],
        "images": [{
            "contentType": "IMAGE",
            "title": "Pacemaker's 800m final fail",
            "description": "Athletics: At the recent Diamond League meeting in Rome, Kenyan Job Kinyor had the role of pacemaker for the men's 800 metre final.",
            "link": "http://cdn.newsapi.com.au/image/v1/f035eec8d9555c7cddcd2f5a7a43d159",
            "version": "PUBLISHED",
            "format": "jpeg",
            "width": 160,
            "height": 90,
            "imageName": "5348771529001_5470342784001_5470343978001-th.jpg",
            "imageType": "THUMBNAIL"
        }, {
            "contentType": "IMAGE",
            "title": "Pacemaker's 800m final fail",
            "description": "Athletics: At the recent Diamond League meeting in Rome, Kenyan Job Kinyor had the role of pacemaker for the men's 800 metre final.",
            "link": "http://cdn.newsapi.com.au/image/v1/c99610be9351a516d8f3cd51f09f2275",
            "version": "PUBLISHED",
            "format": "jpeg",
            "width": 640,
            "height": 360,
            "imageName": "5348771529001_5470342786001_5470343978001-vs.jpg",
            "imageType": "HERO"
        }, {
            "contentType": "IMAGE",
            "title": "Pacemaker's 800m final fail",
            "description": "Athletics: At the recent Diamond League meeting in Rome, Kenyan Job Kinyor had the role of pacemaker for the men's 800 metre final.",
            "version": "PUBLISHED",
            "format": "jpeg",
            "width": 640,
            "height": 360,
            "imageName": "5348771529001_5470342786001_5470343978001-vs.jpg",
            "imageType": "SOURCE"
        }],
        "ooyalaId": "5348771529001-5470343978001",
        "duration": 86000
    },
    "query": {
        "api_key": "9h3cd6ga9au79sg7xzm53y5g"
    },
    "product": {
        "name": "video"
    },
    "config": {
        "product": "video",
        "output": "json"
    },
    "host": "a.tcog.news.com.au"
}
```

Be aware though, that the categories result for a OOYALA video are different.

> This document was written after the effort of refactoring our existing video templates to work with a new backend video integrator - Brightcove. Effectively, we had to cope with two video systems, the other being the legacy OOYALA.

The result is similar with a legacy OOYALA id:

http://localhost:3000/news/content/v2/origin:video_integrator.I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh?domain=news.com.au&t_product=video&t_output=json

``` json
{
    "display": {
        "site": "news.com.au"
    },
    "data": {
        "contentType": "VIDEO",
        "id": {
            "value": "4a008ffb16d9cf6bf18ca4b12621f629",
            "link": "http://cdn.newsapi.com.au/content/v2/4a008ffb16d9cf6bf18ca4b12621f629"
        },
        "originId": "I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh",
        "origin": "VIDEO_INTEGRATOR",
        "title": "Crisis",
        "subtitle": "Crisis",
        "description": "After the tragic death of Princess Diana, Prince Charles came to rely on a new type of royal press advisor - a spin doctor. Mark Bolland, former director of the Press Complaints Commission got to work rebuilding Prince Charles' public image.",
        "paidStatus": "NON_PREMIUM",
        "originalSource": "Oovvuu",
        "version": "PUBLISHED",
        "dateUpdated": "2017-06-05T22:37:00.000+10:00",
        "dateLive": "2017-06-05T17:03:08.000+10:00",
        "dateCreated": "2017-06-05T17:03:08.000+10:00",
        "status": "ACTIVE",
        "related": [],
        "domainLinks": [{
            "name": "adelaidenow.com.au",
            "link": "http://www.adelaidenow.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "ntnews.com.au",
            "link": "http://www.ntnews.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "news.com.au",
            "link": "http://www.news.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "townsvillebulletin.com.au",
            "link": "http://www.townsvillebulletin.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "heraldsun.com.au",
            "link": "http://www.heraldsun.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "cairnspost.com.au",
            "link": "http://www.cairnspost.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "theaustralian.com.au",
            "link": "http://www.theaustralian.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "goldcoastbulletin.com.au",
            "link": "http://www.goldcoastbulletin.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "themercury.com.au",
            "link": "http://www.themercury.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "perthnow.com.au",
            "link": "http://www.perthnow.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "couriermail.com.au",
            "link": "http://www.couriermail.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "businessspectator.com.au",
            "link": "http://www.businessspectator.com.au/businesstv/I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh"
        }, {
            "name": "foxsportspulse.com",
            "link": "http://www.foxsportspulse.com/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "weeklytimesnow.com.au",
            "link": "http://www.weeklytimesnow.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "foxsports.com.au",
            "link": "http://www.foxsports.com.au/video?=Crisis_&vc=-1"
        }, {
            "name": "dailytelegraph.com.au",
            "link": "http://www.dailytelegraph.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }, {
            "name": "geelongadvertiser.com.au",
            "link": "http://www.geelongadvertiser.com.au/video/id-I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/Crisis"
        }],
        "primaryCategory": {
            "value": "/video/video.news.com.au/TV/Biography/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/TV/Biography/"
        },
        "categories": [{
            "value": "/video/video.news.com.au/TV/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/TV/"
        }, {
            "value": "/video/video.news.com.au/TV/Biography/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/TV/Biography/"
        }, {
            "value": "/video/video.news.com.au/TV/Current Affairs/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/TV/Current%20Affairs/"
        }, {
            "value": "/video/video.news.com.au/TV/History/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/TV/History/"
        }, {
            "value": "/video/video.news.com.au/episodes/1/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/episodes/1/"
        }, {
            "value": "/video/video.news.com.au/genres/Biography, History/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/genres/Biography,%20History/"
        }, {
            "value": "/video/video.news.com.au/genres/primary/Current Affairs/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/genres/primary/Current%20Affairs/"
        }, {
            "value": "/video/video.news.com.au/oovvuuIds/EDML0107/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/oovvuuIds/EDML0107/"
        }, {
            "value": "/video/video.news.com.au/showIds/EDML-ReinventingTheRoyals/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/showIds/EDML-ReinventingTheRoyals/"
        }, {
            "value": "/video/video.news.com.au/showNames/Reinventing the Royals/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/showNames/Reinventing%20the%20Royals/"
        }, {
            "value": "/video/video.news.com.au/subProviders/other/",
            "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/subProviders/other/"
        }],
        "keywords": [],
        "authors": [],
        "domains": ["adelaidenow.com.au", "ntnews.com.au", "news.com.au", "townsvillebulletin.com.au", "heraldsun.com.au", "cairnspost.com.au", "theaustralian.com.au", "goldcoastbulletin.com.au", "themercury.com.au", "perthnow.com.au", "couriermail.com.au", "businessspectator.com.au", "foxsportspulse.com", "weeklytimesnow.com.au", "foxsports.com.au", "dailytelegraph.com.au", "geelongadvertiser.com.au"],
        "locationGeoPoints": [],
        "urlTitle": "crisis",
        "revision": 4,
        "videoFiles": [],
        "images": [{
            "contentType": "IMAGE",
            "link": "http://content6.video.news.com.au/I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh/promo320914995",
            "version": "PUBLISHED",
            "related": [],
            "domainLinks": [],
            "categories": [],
            "keywords": [],
            "authors": [],
            "domains": [],
            "locationGeoPoints": [],
            "format": "jpg",
            "width": 0,
            "height": 0,
            "imageType": "SOURCE"
        }, {
            "contentType": "IMAGE",
            "link": "http://cdn.newsapi.com.au/image/v1/external?url=http%3A%2F%2Fcontent6.video.news.com.au%2FI2cHZnYjE6RvY16ermiEgx5E6wt-5PRh%2Fpromo320914995&width=650&api_key=kq7wnrk4eun47vz9c5xuj3mc",
            "version": "PUBLISHED",
            "related": [],
            "domainLinks": [],
            "categories": [],
            "keywords": [],
            "authors": [],
            "domains": [],
            "locationGeoPoints": [],
            "format": "jpg",
            "width": 0,
            "height": 0,
            "imageType": "HERO"
        }, {
            "contentType": "IMAGE",
            "link": "http://cdn.newsapi.com.au/image/v1/external?url=http%3A%2F%2Fcontent6.video.news.com.au%2FI2cHZnYjE6RvY16ermiEgx5E6wt-5PRh%2Fpromo320914995&width=152&api_key=kq7wnrk4eun47vz9c5xuj3mc",
            "version": "PUBLISHED",
            "related": [],
            "domainLinks": [],
            "categories": [],
            "keywords": [],
            "authors": [],
            "domains": [],
            "locationGeoPoints": [],
            "format": "jpg",
            "width": 0,
            "height": 0,
            "imageType": "THUMBNAIL"
        }, {
            "contentType": "IMAGE",
            "link": "",
            "version": "PUBLISHED",
            "related": [],
            "domainLinks": [],
            "categories": [],
            "keywords": [],
            "authors": [],
            "domains": [],
            "locationGeoPoints": [],
            "format": "jpg",
            "width": 0,
            "height": 0,
            "imageType": "COVERART"
        }, {
            "contentType": "IMAGE",
            "link": "",
            "version": "PUBLISHED",
            "related": [],
            "domainLinks": [],
            "categories": [],
            "keywords": [],
            "authors": [],
            "domains": [],
            "locationGeoPoints": [],
            "format": "jpg",
            "width": 0,
            "height": 0,
            "imageType": "SHOWART"
        }],
        "ooyalaId": "I2cHZnYjE6RvY16ermiEgx5E6wt-5PRh",
        "duration": 2970560,
        "fullDescription": "After the tragic death of Princess Diana, Prince Charles came to rely on a new type of royal press advisor - a spin doctor. Mark Bolland, former director of the Press Complaints Commission got to work rebuilding Prince Charles' public image. His main challenge was to create a degree of public acceptance for the by now \"non-negotiable\" Camilla Parker Bowles, but his controversial methods were not popular amongst other royals and courtiers.",
        "time": {
            "cuepoints": [498, 1011, 1380, 1957, 2441],
            "credits": 2938
        }
    },
    "query": {
        "api_key": "9h3cd6ga9au79sg7xzm53y5g"
    },
    "product": {
        "name": "video"
    },
    "config": {
        "product": "video",
        "output": "json"
    },
    "host": "a.tcog.news.com.au"
}
```

The differences between the two category results are:

``` javascript
// brightcove
{
    "primaryCategory": {
        "value": "/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/More Sports/",
        "link": "http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/More%20Sports/",
        "id": "1226506797283",
        "isDominant": true
    },
    "categories": [{
        "value": "/display/newscorpaustralia.com/Web/NewsNetwork/Sport news and galleries/More Sports/",
        "link": "http://cdn.newsapi.com.au/category/v2/display/newscorpaustralia.com/Web/NewsNetwork/Sport%20news%20and%20galleries/More%20Sports/",
        "id": "1226506797283",
        "isDominant": true
    }
}

// ooyala
{
    "primaryCategory": {
        "value": "/video/video.news.com.au/TV/Biography/",
        "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/TV/Biography/"
    },
    "categories": [{
        "value": "/video/video.news.com.au/TV/",
        "link": "http://cdn.newsapi.com.au/category/v2/video/video.news.com.au/TV/"
    }
}
```

This is then rendered by the `/views/video/video.jade` template, which will send over the items categories over a URL like:

```
http://localhost:3000/news/video/categories?t_template=../video/index&t_product=video&td_domain=news.com.au&td_categories=THE_VIDEO_CATEGORIES&td_list_style=line"
```

Where `THE_VIDEO_CATEGORIES` is a CSV encoding of the categories for that particular video.

This is then rendered by the `/views/video/index.jade` template, which will then filter them by what also appear in the `video/categories` response (so filters the video's categories with those applicable for the current site).

For each category, it will then defer to the `/videws/video/module.jade` template with urls that look like:

```
http://localhost:3000/news/content/v2/?maxRelated=20&pageSize=20&offset=0&query=(contentType:video+AND+domains:news.com.au&categories.value=SOME_CATEGORY_VALUE)&td_domain=news.com.au&t_product=video&t_template=../video/module&td_list_style=APPLICABLE_STYLE&td_path=CATEGORY_TITLE
```

Which will then render the category's header with `/views/video/list-header.jade` as well as use a mixin to render the videos for that category. The URL for list-header will look like:

```
http://localhost:3000/news/video/categories?t_template=../video/list-header&t_product=video&td_domain=news.com.au&td_path=THE_PATH_PARAM&td_root=THE_ROOT_PARAM"
```

Inside `views/video/list-header.jade` we can suspect the following:

- It uses the path param to filter all the categories by titles that start with it.

- The root param seems to be legacy from the old video category days.

- The path param here could be rewritten to just use the `td_category=THE_CATEGORY_ID` and then use a `var category = categories.find(category => category.id = display.category); var childCategories = categories.filter(childCategory => (category.cids || []).indexOf(childCategory.id))` with the new processing we've done on the video data. This would be a lot simpler than the fulltitle deconstruction then reconstruction then filter method that was used for the old category system and updated for the new.


### video playlist route

Inside our `router.jade` we have:

```
    //- Video Playlist
    //- e.g. /video/playlist/rememberingmandela
    esi:when(test="$(AKA_PM_FWD_URL) matches_i '''^/[^/]+/playlist/(.*?)/?$'''" matchname="pathvars")
        //- these params are not CAPI v2 compatible: subtitle
        +esiDca("/news/content/v2/collection/?query=(contentType:video AND subtitle:$(pathvars{1}) AND domains:$(HOSTNAME))&pageSize=1&offset=0&t_product=" + product.name + "&t_template=../video/playlist-pre-flight&td_domain=$(HOSTNAME)")
```

However we are not aware of any code that actually uses this route.


### video category route

Inside our `router.jade` we have:

```
    //- Video Categories and Sub Categories
    //- e.g. /video/Sport/
    //- e.g. /video/Sport/MotorSport/
    esi:when(test="$(AKA_PM_FWD_URL) matches_i '''^/[^/]+/([^?]+?)/?$'''" matchname="pathvars")
        +esiDca("/news/video/categories?t_product=" + product.name + "&t_template=../video/index&td_domain=$(HOSTNAME)&td_path=$(pathvars{1})&td_list_style=block&td_banner=true")
```

This will then hit a url like:

```
http://localhost:3000/news/video/categories?t_prouct=video&t_template=../video/index&td_domain=news.com.au&td_path=/Sport/MotorSport/&td_list_style=block&td_banner=true
```

Which to note, that the `td_path` is the same as the `fullTitle` property on the categories. So that is why it works with the `index.jade` template. The `td_banner` param here, instructs the `index.jade` template to do what it usually does, but in addition to display the banner template for the first category it returns.



### video hub route

Inside our `router.jade` we have:

```
    //- Video Hub
    //- e.g. /video/
    esi:otherwise
        +esiDca("/news/content/v2?query=(contentType:video AND domains:$(HOSTNAME))&maxRelated=20&pageSize=5&offset=0&t_product=" + product.name + "&t_template=../video/banner&td_domain=$(HOSTNAME)")
        +esiDca("/news/video/categories?t_product=" + product.name + "&t_template=../video/index&td_domain=$(HOSTNAME)")
```

This will then hit urls like:

```
http://localhost:3000/news/content/v2?query=(contentType:video AND domains:news.com.au)&maxRelated=20&pageSize=5&offset=0&t_product=video&t_template=../video/banner&td_domain=news.com.au
http://localhost:3000/news/video/categories?t_prouct=video&t_template=../video/index&td_domain=news.com.au
```

This will display the banner for that site, as well as show the category listing for that site.
