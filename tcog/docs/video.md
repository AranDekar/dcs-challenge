
# Video specific TCog endpoints


## component/video

    http://localhost:3000/component/video?t_product=video&td_host=www.dailytelegraphsit.com.au

## news/video/categories

    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/index
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/index&td_path=News/Politics&td_list_style=block

    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=entertainment
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=business
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=travel
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=news
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=technology





# Page requests

## /video/

    http://localhost:3000/component/video?t_product=video&td_host=www.dailytelegraphsit.com.au
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&td_domain=DailyTelegraph&t_template=../video/index
    http://localhost:3000/search?t_product=video&domain=DailyTelegraph&t_template=../video/moduleSpecial&td_title=Most%20Popular&category=/video/dailytelegraphsit.com.au/collection/popular-content/all/24hours&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/search?t_product=video&domain=DailyTelegraph&t_template=../video/banner&type=video&maxRelated=20&pageSize=5&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&category=/video/video.news.com.au/news&td_path=news&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&category=/video/video.news.com.au/entertainment&td_path=entertainment&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&category=/video/video.news.com.au/business&td_path=business&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&category=/video/video.news.com.au/lifestyle&td_path=lifestyle&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&category=/video/video.news.com.au/sport&td_path=sport&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=news
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=entertainment
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&category=/video/video.news.com.au/breaking+news&td_path=breaking%20news&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&category=/video/video.news.com.au/travel&td_path=travel&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&category=/video/video.news.com.au/technology&td_path=technology&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=business
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=lifestyle
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=sport
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=travel
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=technology


## /video/News/

    http://localhost:3000/component/video?t_product=video&td_host=www.dailytelegraphsit.com.au
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&td_domain=DailyTelegraph&t_template=../video/index&td_path=News&td_list_style=block
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&td_list_style=block&category=/video/video.news.com.au/news&td_path=news&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=news
    http://localhost:3000/search?t_product=video&td_site=www.dailytelegraphsit.com.au&domain=DailyTelegraph&t_template=../video/banner&category=/video/video.news.com.au/News/&maxRelated=20&pageSize=5&offset=0


## /video/id-VvMzh0bzpnT9XTziqUTOAlRiKnDZsbnq/Mr--Wonderful-s-Tips-on-How-to-Win--Shark-Tank--

    http://localhost:3000/component/video?t_product=video&td_host=www.dailytelegraphsit.com.au
    http://localhost:3000/news/content/v1/origin:video_integrator.VvMzh0bzpnT9XTziqUTOAlRiKnDZsbnq?t_product=video&td_site=DailyTelegraph&t_template=../video/video
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&td_domain=DailyTelegraph&t_template=../video/index&td_path=business,lifestyle,news,news/usa&td_list_style=line
    http://localhost:3000/search?t_product=video&t_template=../video/moduleSpecial&td_title=Most%20Popular&category=/video/dailytelegraphsit.com.au/collection/popular-content/all/24hours&maxRelated=20&pageSize=20
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&td_list_style=line&category=/video/video.news.com.au/news&td_path=news&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&td_list_style=line&category=/video/video.news.com.au/lifestyle&td_path=lifestyle&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&td_list_style=line&category=/video/video.news.com.au/business&td_path=business&maxRelated=20&pageSize=20&offset=0
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=news
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=lifestyle
    http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=business


# new

## capi

new brightcove: http://www.news.com.au/remote/jsonp-proxy.esi?url=http://cdn.newsapi.com.au/uat/content/v2/origin:brightcove.5348771528001-5402793651001&api_key=nbggb6jxgbf3eftej3sfc42a&callback=_video_jsonp_73421

old video integrator: http://www.news.com.au/remote/jsonp-proxy.esi?url=http://cdn.newsapi.com.au/uat/content/v2/b662be1ad61a6fdadb988471eaea8e2f&api_key=nbggb6jxgbf3eftej3sfc42a&callback=_video_jsonp_73421


## video/video

http://localhost:3000/news/content/v1/origin:video_integrator.Y2bWIxYjE6ae4QTa91ithtW1nsW036hQ?t_product=video&td_site=DailyTelegraph&t_template=../video/video

http://localhost:3000/news/content/v1/origin:video_integrator.Y2bWIxYjE6ae4QTa91ithtW1nsW036hQ?t_product=video&td_site=DailyTelegraph&t_template=../video/video


## video/index

http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&td_domain=dailytelegraph.com.au&t_template=../video/index&td_path=sport,sport/football,sport/football/a-league,sourceid,sourceid/621620&td_list_style=line


## video/list-header

http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header&td_path=sport/football

http://localhost:3000/news/video/categories?t_product=video&site=DailyTelegraph&t_template=../video/list-header

http://localhost:3000/news/video/categories?t_product=video&site=news.com.au&t_template=../video/list-header&td_path=sport

http://localhost:3000/news/video/categories?t_product=video&site=news.com.au&t_template=../video/list-header


## video/module

http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=DailyTelegraph&t_template=../video/module&td_list_style=line&category=/video/video.news.com.au/news&td_path=news&maxRelated=20&pageSize=20&offset=0

http://localhost:3000/news/content/v1/?t_product=video&td_site=DailyTelegraph&domain=dailytelegraph.com.au&t_template=../video/module&td_list_style=line&category=/video/video.news.com.au/sport/football&td_path=sport%2Ffootball&maxRelated=20&pageSize=20&offset=0

http://localhost:3000/search?t_product=video&domain=news.com.au&t_template=../video/module&origin=omniture&category=/video/news.com.au/collection/popular-content/all/today&maxRelated=4&offset=0&esi=true

http://localhost:3000/search?t_product=video&domain=news.com.au&t_template=../video/module&origin=omniture&category=/video/news.com.au/collection/popular-content/sport/today&maxRelated=4&offset=0&esi=true


## video/moduleSpecial

http://localhost:3000/search?t_product=video&t_template=../video/moduleSpecial&td_title=Most%2520Popular&domain=news.com.au&category=/video/video.news.com.au/collection/popular-content/all/24hours&maxRelated=20&pageSize=20

http://localhost:3000/news/content/v2/?t_product=video&pageSize=3&t_template=s3/ncatemp/standalone/video/v2/video-three-image&td_group-header=video&td_link=http://www.news.com.au/video/entertainment&td_more_link=http://www.news.com.au/video/entertainment&query=(origin%3A%20VIDEO_INTEGRATOR%20AND%20paidStatus%3DNON_PREMIUM%20AND%20categories.value%3D%22%2Fvideo%2Fvideo.news.com.au%2Fentertainment%2F%22)
