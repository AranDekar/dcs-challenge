---
title: TCOG API Reference

language_tabs: # must be one of https://git.io/vQNgJ
  - shell

toc_footers:
  - <a href='https://github.com/lord/slate'>Documentation Powered by Slate</a>

search: true
---
<a href='./index.html'>Go Back</a>

# TCOG Introduction

<aside class="notice">
To use tcog you will need a valid `t_product=tcog` URI parameter or `X-TCOG-Product` HTTP request header.
</aside>

### Common Query Parameters

TCOG utilizes some common query parameters across endpoints.

Parameter |	Description
--------- | -----------
t_product | product identifier for config and quotas.
t_domain | override default `t_product` domain.
t_contentType | defaults to `text/html; charset=utf-8`.
t_template | template src path.

The `t_template` parameter can also be passed via the `X-TCOG-Template` HTTP request header.

## Conventions

TCOG passes on every query parameter, except those prefixed with `t_` (eg: t_product), to the downstream data endpoints.

Parameter |	Description
--------- | -----------
t_* | top level tcog options
tc_* | signifies config parameters (for TCOG to interpret)
td_ | signifies parameters that will be passed into the template (for template devs to pass input into their templates).

## Legacy Views

TCOG has default templates for each endpoint call, which will be rendered if a `t_template` is not specified.

These templates are considered legacy and will be refactored out of the codebase at some point. When mentioned below it is for the purposes of understanding front end logic.

# CAPI

## GET: V3 Advanced Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/search?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/search`

## GET: V3 Author

```shell
curl http://sit2.tcog.news.com.au/news/v3/authors/172932881101319eceb25196d582cdee?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/authors/{id}`

## GET: V3 Author Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/authors?t_product=tcog&t_output=json&firstName=Tyson
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/authors/`

## GET: V3 Article

```shell
curl http://sit2.tcog.news.com.au/news/v3/articles/7eaae2348d98fc2fb17822f43ed3cd24?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/articles/{id}`

## GET: V3 Article Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/articles?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/articles/`

## GET: V3 Collection

```shell
curl http://sit2.tcog.news.com.au/news/v3/collections/ada1957d09e03f178dcfec7a7135f07f?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/collections/{id}`

## GET: V3 Collection Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/collections?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/collections/`

## GET: V3 Custom

```shell
curl http://sit2.tcog.news.com.au/news/v3/customs/03159d63b65344ef26257d5ebaecc7b6?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/customs/{id}`

## GET: V3 Custom Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/customs?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/customs/`

## GET: V3 Image

```shell
curl http://sit2.tcog.news.com.au/news/v3/images/83b31332e5c67e30b84b204f61ff907c?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/images/{id}`

## GET: V3 Image Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/images?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/images`

## GET: V3 File

```shell
curl http://sit2.tcog.news.com.au/news/v3/files/d810ea050eae8777dc6a9fd39fa26b17?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/files/{id}`

## GET: V3 File Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/files?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/files`

## GET: V3 Video

```shell
curl http://sit2.tcog.news.com.au/news/v3/videos/0796476f7dbf197f955a752c870f8533?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/videos/{id}`

## GET: V3 Video Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/videos?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/videos`

## GET: V3 Domain

```shell
curl http://sit2.tcog.news.com.au/news/v3/domains/1208921779453?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/domains/{id}`

## GET: V3 Domain Search

```shell
curl http://sit2.tcog.news.com.au/news/v3/domains?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/domains`

## GET: V3 Section

```shell
curl http://sit2.tcog.news.com.au/news/v3/sections/1226669271348?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/sections/{id}`

## GET: V3 Sections By Domain

```shell
curl http://sit2.tcog.news.com.au/news/v3/sections/domains/dailytelegraph.com.au?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/sections/domains/{domain}`

## GET: V3 Sections With Children

```shell
curl http://sit2.tcog.news.com.au/news/v3/sections/1226669271348/children?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/sections/{id}/children`

## GET: V3 Routes By Domain

```shell
curl http://sit2.tcog.news.com.au/news/v3/routes/domains/news.com.au?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/routes/domains/{domain}`

## GET: V3 Route

```shell
curl http://sit2.tcog.news.com.au/news/v3/routes/012ed42f8d2da82c7777b01976f76e3b?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/routes/{id}`

## GET: Routes With Children

```shell
curl http://sit2.tcog.news.com.au/news/v3/routes/012ed42f8d2da82c7777b01976f76e3b/children/sections?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/routes/{id}/children/sections`

## GET: Syndication By Domain

```shell
curl http://sit2.tcog.news.com.au/news/v3/sections/syndications/domains/news.com.au?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/sections/syndications/domains/{domain}`

## GET: Syndication By Section

```shell
curl http://sit2.tcog.news.com.au/news/v3/sections/syndications/1226669271348?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/sections/syndications/{id}`

## GET: Category

```shell
curl http://sit2.tcog.news.com.au/news/v3/categories/426ff387283bc43a206f61e15124b267?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/v3/categories/{id}`

## GET: V2 Search

```shell
curl http://tcog.news.com.au/news/content/v2/?t_product=tcog&t_template=s3/networkeditorial-tg_tlc_contentgrid/index&pageSize=12&query=contentType%3A%22IMAGE_GALLERY%22%20AND%20categories.value%3A%22%2Fdisplay%2Fnewscorpaustralia.com%2FWeb%2FMessenger%2FLocal%20Premium%20Galleries%2F%22%20AND%20domains%3Dadelaidenow.com.au&esi=true&td_clientDebug=true&td_columns=3&td_device=desktop
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/content/v2/`

## GET: V2 Resource

```shell
curl http://tcog.news.com.au/news/content/v2/c92920df3ee4a920851de0bd69604b64?t_product=tcog&t_template=../video/player
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/content/v2/{id}`

## GET: V2 Video Categories

```shell
curl http://tcog.news.com.au/news/video/categories?t_product=tcog&site=news.com.au&td_domain=news.com.au&t_template=../video/index&td_path=entertainment/tv&td_list_style=block
```

### HTTP Request

`GET http://a.tcog.news.com.au/news/video/categories`

## GET: V1 Search

```shell
curl http://tcog.news.com.au/news/content/v1/?category=/section/theaustralian.com.au/collection/popular-content/business/24hours/&format=module&t_product=tcogn&maxRelated=3&t_template=s3/ncatemp/index@test&origin=omniture&domain=theaustralian.com.au
```

### HTTP Request

`GET http://tcog.news.com.au/news/content/v1/`

<aside class="warning">
Version 1 API calls are deprecated.
</aside>

## GET: V1 Resource

### HTTP Request

`GET http://tcog.news.com.au/news/content/v1/{id}`

<aside class="warning">
Version 1 API calls are deprecated.
</aside>


## GET: V1 Author

```shell
curl http://tcog.news.com.au/component/author/169f6e6f2377002466c5c2ffd2674246/?esi=true&t_product=tcog&t_template=s3/austemp-article_common/vertical/author/widget&td_bio=false&td_bylinetitle=Associate%20editor
```

### HTTP Request

`GET http://a.tcog.news.com.au/component/author/{id}`

<aside class="warning">
Version 1 API calls are deprecated.
</aside>

## GET: V1 Collection Resource

```shell
curl http://tcog.news.com.au/news/content/v1/collection/e5e3091cb2ad35e4a18ceee85eddf73d?t_product=tcog&pageSize=6&domain=adelaidenow.com.au&t_template=imageblock&td_imagewidth=650
```

### HTTP Request

`GET http://tcog.news.com.au/news/content/v1/collection/{id}`

<aside class="warning">
Version 1 API calls are deprecated.
</aside>

# Chartbeat

## GET: Resource

```shell
curl http://tcog.news.com.au/chartbeat/live/toppages/v3/?t_product=tcog&limit=10&host=weeklytimesnow.com.au&sort_by=social&type=article&t_template=s3/chronicle-tg_tcog_fragments/trending&td_disableCss=true
```

### HTTP Request

`GET http://a.tcog.news.com.au/chartbeat/{path}`


# Deck

Deck produces static HTML stored within JSON on s3 for rendering as 'longform'.

## Deck Document URL

```shell
http://dcs3.tcog.news.com.au/component/resource/deck/20609.json?t_product=HeraldSun&t_template=s3/ncatemp/index-standard@native-deck-dna&td_device=desktop&td_title=Australia%E2%80%99s%20best%20spots%20to%20retire&td_titleextended=Best%20places%20to%20retire%20around%20Australia&td_titleseo=Retirement%20planning%3A%20Best%20places%20to%20retire%20in%20Australia&td_titlesocial=5%20best%20spots%20to%20retire%20in%20Australia&td_pageurl=https%3A%2F%2Fwww.heraldsun.com.au%2Ffeature%2Fspecial-features%2Fbest-places-to-retire-around-australia%2Fnews-story%2F12a97ec09dab82db2676dc07fe47a540&td_canonical=https%3A%2F%2Fwww.heraldsun.com.au%2Ffeature%2Fspecial-features%2Fbest-places-to-retire-around-australia%2Fnews-story%2F12a97ec09dab82db2676dc07fe47a540&td_intro=You%20spend%20most%20of%20your%20life%20working%20hard%2C%20but%20when%20do%20you%20get%20the%20time%20to%20relax%20and%20enjoy%20life%3F%20Your%20retirement%20years%20are%20the%20ideal%20time%20to%20see%20the%20world%20and%20find%20your%20dream%20location.%20We%20have%20uncovered%20five%20of%20the%20best%20locations%20to%20spend%20your%20golden%20years.&td_description=It%20takes%20a%20lifetime%20to%20see%20all%20the%20beautiful%20spots%20around%20Australia%2C%20and%20there%E2%80%99s%20no%20better%20time%20to%20explore%20than%20in%20retirement.%20Here%20are%20five%20of%20the%20best.&td_ogimage=https://cdn.newsapi.com.au/image/v1/59c0774f61542db46d3230b0d206a9ac&td_author=Staff%20writer&td_storyid=12a97ec09dab82db2676dc07fe47a540&esi=true
```

### HTTP Request

`GET http://dcs3.tcog.news.com.au/component/resource/deck/{deck_document_id}.json?{params}`

# Firestore

We support a JSON integration with Google Firestore: see `https://firebase.google.com/docs/firestore/`

## GET: Firestore Collection and Document

```shell
curl http://tcog.news.com.au/firestore/v1/projects/ncau-ed-taus-lists/databases/(default)/documents/rich-250?t_product=tcog&t_output=json
```

### HTTP Request

`GET http://tcog.news.com.au/firestore/v1/projects/{path}?t_product=tcog&t_output=json`

# Foxsport

## GET: Foxsports Sport Data

```shell
curl http://tcog.news.com.au/foxsports/3.0/api/sports/afl/series/1/seasons/121/fixturesandresults.json?t_product=DailyTelegraph&t_template=s3/chronicle-tg_tlc_scoreboard/index&td_layout=fixturesandresults&td_limit=2
```

### HTTP Request

`GET http://a.tcog.news.com.au/foxsports/{path}?t_product=tcog&t_output=json`

# Foxsports Pulse

## GET: FoxsportsPulse Sport Data

```shell
curl http://tcog.news.com.au/foxsportspulse/v2/compdata/competitions/305244/ladders?t_product=HeraldSun&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/foxsportspulse/{path}?t_product=tcog&t_output=json`

# Nmdata

NMData provides financial information for NCA.

`http://prod.marketdata.digprod.cp1.news.com.au/nmdata`

## GET: Fetch list of top gainers for today

```shell
curl http://tcog.news.com.au/component/resource/nmdata/topmovers/topgainers?t_product=tcog&t_template=s3/ncatemp/standalone/finance/asx-top-gainers
```

### HTTP Request

`GET http://tcog.news.com.au/component/resource/nmdata/topmovers/topgainers?t_product=tcog&t_template=s3/ncatemp/standalone/finance/asx-top-gainers`

# Personalisation

Personalisation (aka "p13n") is currently done via integration with the [Vidora](https://www.vidora.com/) API.

## GET: Recommended Content

This call will return 10 CAPI articles in a JSON structure, recommended for the specified user_id (an `nk` - News Key). There are
separate endpoints for CAPIv2 and CAPIv3 data structures.


Parameter |	Description
--------- | -----------
user_id | The nk (news key) representing the user's ID in Vidora.


```shell
curl http://a.tcog.news.com.au/p13n/v2/users/:user_id/recommendations?t_product=tcog&t_output=json
```


```shell
curl http://a.tcog.news.com.au/p13n/v3/users/:user_id/recommendations?t_product=tcog&t_output=json
```

## GET: Similar Content

This call will return 10 CAPI articles in a JSON structure that are similar to a given article_id and unread by the specified user_id. 

Similar items are currently only available via CAPI v2.

Use of the CAPIv3 personalisation endpoint is recommended to make use of Curator.

Parameter |	Description
--------- | -----------
user_id | The nk (news key) representing the user's ID in Vidora.
article_id | The CAPI id of the V2 artifcle.


```shell
curl http:///a.tcog.news.com.au/p13n/v2/users/:user_id/items/:article_id/similars?t_product=AdelaideNow&t_output=json
```

### HTTP Requests

`GET http://a.tcog.news.com.au/p13n/v2/users/:user_id/items/:article_id/similars?t_product=AdelaideNow&t_output=json`

## GET: Modules

Returns a list of 10 recommended sections/categories for the user. As there is no CAPI call involved here, there is no `/v2` or `/v3` path specified.

Parameter |	Description
--------- | -----------
user_id | The nk (news key) representing the user's ID in Vidora.

```shell
curl http://a.tcog.news.com.au/p13n/users/:user_id/modules?t_product=tcog&t_output=json
```

### HTTP Requests

`GET http://a.tcog.news.com.au/p13n/users/:user_id/modules?t_product=tcog&t_output=json`


# Popular Combined Content

The popular combined content endpoint is used to render the footer of most mastheads, showing the combined popular content of news in our syndicate. 
As of late 2017, it also integrated a call to the Western Australian News (WAN) servers to integrate PerthNow content in the footer.
It is also known as the 'popular-combined' endpoint.

The default template for this endpoint is http://stash.news.com.au/projects/DCS/repos/pp-services/browse/tcog/views/common/popular-combined-footer.jade.

## GET: Popular Combined 

Parameter |	Description
--------- | -----------
t_domain | a comma separated list of domains to include in the combined popular content. The first domain is the primary domain and has 10 results, the others have 5.

```shell
curl http://tcog.news.com.au/component/popular-combined?t_product=tcog&t_domain=cairnspost.com.au,perthnow.com.au,news.com.au&td_primary_bound=5
```

### HTTP Request

`GET http://a.tcog.news.com.au/component/popular-combined?t_domain=`


# Sport

## GET: Player Profile

An endpoint that displays sporting statistics and content about a player.

This endpoint calls Foxsports with a Player ID and, optionally, CAPI v3 with a player name if `t_player_name` is provided.

The response will hold `foxsports` and `capi` results for each of the above.

Parameter |	Description
--------- | -----------
playerId | The expanded path into the Foxsports v3 API for player profiles - e.g. `cricket/series/26/players/601079`
t_domain | The player's fullname, which is used as a v3 Match Search on the extendedHeadline in CAPI


```shell
curl http://a.tcog.news.com.au/sport/profile/cricket/series/26/players/601079?t_product=tcog&t_output=json&t_player_name=Glenn+Maxwell
```

### HTTP Request

`GET http://a.tcog.news.com.au/sport/profile/{playerId}?{t_player_name}`


# Whistleout

### Resource URL

`https://r3.whistleout.com.au`


# Wordpress

The following endpoints integrate with the Wordpress API explained at `https://newscorpauapi.docs.apiary.io/#reference/endpoints`.

<aside class="notice">
Any call into SPP API that carries a URI parameter giving away the SPP API key is considered insecure and dangerous. As of late April, 2018, the decision to deprecate any SPP-API call that involves passing an spp_api_key URI parameter has been made. This will happen after the Broadsheet theme in The Australian has gone to production.
</aside>

## GET: Page

```shell
curl http://a.tcog.news.com.au/spp-api/v1/pages/?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&spp_api_pagename=story/budget-2017&t_product=tcog&t_domain=theaustralian.com.au&t_contentType=application/json&td_pagepos=main-content-mobile&td_myprimarycategory=budget-2017&td_mysecondarycategory=primary-category-only&td_startcount=0&td_stopcount=999&t_template=s3/austemp-article_common/vertical/spp-widgets
```

### HTTP Request

`GET http://a.tcog.news.com.au/spp-api/v1/pages/`

### Query Parameters

Parameter |	Description
--------- | -----------
spp_api_key |  
spp_api_pagename | 

## GET: Template

### HTTP Request

```shell
curl http://a.tcog.news.com.au/spp-api/v1/template/?path=components.footer.footer&t_product=tcog&t_domain=townsvillebulletin.com.au&w_isArticle=true
```

`GET http://a.tcog.news.com.au/spp-api/v1/template/`

## GET: Widget

``` shell
# 1. Get public widget as HTML
curl http://a.tcog.news.com.au/spp-api/v1/widgets/public/newscorpau_static_template-652/?widgetID=newscorpau_static_template-652&product=tcog
```

```shell
# 2. Get Widget as JSON
curl http://a.tcog.news.com.au/spp-api/v1/widgets/newscorpau_reference_widget-228?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&t_product=tcog
```

```shell
# 3. Get Widget as HTML
curl http://a.tcog.news.com.au/spp-api/v1/widgets/newscorpau_reference_widget-228?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&t_product=tcog&format=html
```

Wordpress supports three different widget calls:

1. Get public widget as HTML
2. Get Widget as JSON
3. Get Widget as HTML

### HTTP Request

`GET http://a.tcog.news.com.au/spp-api/v1/widgets/public/{template}/`

### Query Parameters

Parameter |	Description
--------- | -----------
spp_api_key |  


# Vidora

## GET: V2 Recommendations

```shell
curl http://a.tcog.news.com.au/p13n/v2/users/123/recommendations?t_product=HeraldSun&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/p13n/v2/users/{user_id}/recommendations?t_product={product}&t_output=json`

## GET: V2 Similarities

```shell
curl http://a.tcog.news.com.au/p13n/v2/users/123/items/345/similars?t_product=HeraldSun&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/p13n/v2/users/{user_id}/items/{item_id}/similars?t_product=HeraldSun&t_output=json`

## GET: V3 Recommendations

```shell
curl ttp://a.tcog.news.com.au/p13n/v3/users/123/recommendations?t_product=HeraldSun&t_output=json
```

### HTTP Request

`GET http://a.tcog.news.com.au/p13n/v3/users/{user_id}/recommendations?t_product={product}&t_output=json`