# /transformers

## Archive

The archive endpont provides functionality for fetching legacy content such as old comments which have been archived from Fatwire and stored on S3. In retrospect this should have maybe have been called legacy/coments vs archive/comments.

## CAPI

### v1 - Middleware

#### assets

I think this is an old middle which was added way back to support some stuff the Australian wanted to do as at the time as CAPI did not provide a complete response for related content. I would recommend instrumenting this functionality to determine how often it is accessed.

#### forwardPopularToV2

The intent with this middleware was to interrupt the request and determine if we were making a call to CAPI which matched the conditions outlined in the middleware and if they matched it would amend the url and update paramaters.

The use case was when CAPI made available a content/v2 version of requesting most popular content. There are hundreds of places the old style url has been setup and at the time it was too time prohibited to update in Wordpress / Fatwire. Hence this middleware was born - note whilst the code has been done it was never fully rolled out and might be safe to remove ( Confirm with Charlie )

### v1 - Normalisers

Normalisers are intended to augment a response with additional data such as adding convenience lookups or making available a yet to be implemented CAPI feature. Additionally they can be used to standardise output between a CAPI search containing collections and a collection retrieve.

Note README.md is based upon a prior implementation that cgiffard added with guards. Normalisers are now just simple middleware

### v2

This is CAPI new endpoint, it superceeds v1 and should be used instead of the v1 endpoints where appropriate.

## Chartbeat

Chartbeat is a thirdparty API service which runs on our sites collecting data about how popular articles are and who may be accessing are sites at any given time on a per site, index, and article basis.

This endpoint provides a transparent path to it's API.

### Normalisers

#### extract-ids

The purspose of this normalizer is to augment the origin response to contain IDs in the same format as CAPI. This is to permit cache invalidation via legal kill since it ensures cache-<id> entries are created within redis.

## Components

Think of components as an opinionated way of calling an API or APIs. Within a component predifined calls to an API can be setup only exposing a small subset of paramters to an end user and then using those to populate an API call.

### Article

The article transformer is used to fetch article / gallery content from CAPI. Upon receipt of a response from CAPI a series of middleware is run which augments the response or may redirect a user to a more appropriate url.

#### middleware

#### interleave-media

This middleware provides related content interleaving & atomization. It takes either the body, standfirst, description or bulletList content for an article/gallery and processes it first with Cheerio ( HTML5 DOM Parser ) which helps to clean up the HTML prior to further processing.

> The HTML needs to be cleaned incase it contains broken tags possibly due to the system used to enter it. ( eg: Methode )

The body content is then broken down into a paragraphs array which contains the atomised content. This is possible due to embedded references within the body which can be matched to related content items.

**From this**

```
{
	...
	"related" : [ { contentType : "VIDEO", "id" : { "value" : "123456789" }, ... } ],
	"body"       : "<p>This is a story body with a video<a class="capi-video" capiid="ae3eb02bf0ec3d6707003c9a3d827186" ... ></a></p>"
	...
}
```

**To this**

```
{
	...
	"related"    : [ { contentType : "VIDEO", "id" : { "value" : "123456789" }, ... } ],
	"body"       : "<p>This is a story body <a class="capi-video" capiid="ae3eb02bf0ec3d6707003c9a3d827186" ... ></a>></p>"
	"paragraphs" : [
		{ contentType : "HTML", "html" : "<p>This is a story body with a video</p>" }
		{ contentType : "VIDEO", "id" : { "value" : "123456789" }, ... }
	]
	...
}
```

`standfirst, description & bulletList` content is interleaved in-place.

#### api-key-override

This middleware permits overriding the api key used to fetch content from CAPI instead of using the key defined in the config. A typical usecase for this would be with Kurator. It needs draft content from CAPI and only it's api key permits this.

#### deconstruct-aricle-url

The purpose of this middleware is to extract an ID from the incoming request url which can then be used to make a requst to CAPI. A series of regular expressions are run over the url as part of the extraction process. These expressions take into consideration incorrectly formatted urls and legacy urls. Where possible the source of the ID is identified eg, fatwire for legacy IDs or SPP for CAPI.

#### parse-fatwire-nav

Never really used. The ensentially takes a html navigation tree and converts it to JSON for easier templating.

#### router-enforcer

The purpose of the route enforcer is to ensure that when an article or gallery is requested, the request can be fulfilled and a response returned to a user.

In order to determine if a request is valid the a series of checks are performed against the url. These checks can take into consideration data set as part of the deconstruct-aricle-url middleware and data returned from CAPI.

##### legacy

The legacy rule validates whether the incoming url format matches the format defined within the CAPI document via "dynamicMetadata.linkOrigin". For example:

```
request : /story-ad4561s-1234567899123       ( linkOrigin : fatwire )
capi    : /news-story/adajklfkaj923092840928 ( linkOrigin : SPP )

Based on the above a 301 redirect will be triggered as the incoming request url is mismatched
with the data CAPI has. This rule generally assists with migrating old format urls to new.
```

##### syndicated

The syndicated rule ensures that content can only be accessed by a site if it has access to it. For example the Daily Telegraph has an exclusive piece of content which should only ever be accessed via the Daily Telegraph. The rule ensures that if someone changes the url hostname then if the site does not have access then it is redirected to the canonical owner link. Another example is trying to access paid content via a non paid site.

##### route

The route rule verfies if the incoming request url matches the route as stored in CAPI ( see dynamicMetadata.link / dynamicMetadata.canonical ). Should the incoming request url not match CAPI then a 301 redirect is done to the correct url.

This feature is important for maintain SEO by ensuring content is accessed by the correct url always.


#### content-enforcer

The intent with this middleware is to ensure the article component can only be used to render certain types of content ( gallery / story ). This middleware was previously used but had to be disabled as template auther were incorrectly using the article endpoint to render promos. This should really be re-enabled ( chat with Dan Moore when it can be )

### Author

The author endpoint was added to permit the display of author related content for editorial. Used by nca and taus. Probably could have been added as a top level transformer or below CAPI. The endpoint also processes an erroneous response from CAPI whereby the actual author content as ingested from Gravater is a string and not a JSON object.

tcog corrected this problem as fixing it was very low on the CAPI teams priority and they were also concerned about the impact to other systems already using it.

### Popular-Combined

Poplular combined is a component that permits fetching popular content for a site in parallel as opposed to separate CAPI calls.

Example : http://tcog.news.com.au/component/popular-combined?t_product=newscomau&t_domain=news.com.au,adelaidenow.com.au,theaustralian.com.au,dailytelegraph.com.au,perthnow.com.au,couriermail.com.au,heraldsun.com.au&td_module-classes=network-most-popular&td_module_header=most+read+stories&t_template=s3/chronicle-tg_popular_combined/index2&esi=true

### Resource

The resource component, provides a quick way of adding basic APIs to tcog which mostly return a simple JSON response and require no augmentation. I'd always hoped it could be this easy adding new APIs to tcog so this was kind of me expermienting.

The APIs are accessible via namespaces in the url as defined in the config under the key "api.resource".

### Video

This provides a shortcut to the video/router template. It was added under component since it didn't really map to an API which are usually added a level above. Plus was written by A. Dodson.

## Fatwire

This legacy endpoint and permitted content created in Fatwire from being included into the page. Typically it was used for fetching navigation created in Fatwire but this has since be replaced with the SPP API endpoint.

It's worthwile reviewing usage stats and removing once it's nolonger being hit.

## Foxsports

The Foxsports stats API

## Foxsports Pulse

The sporting pule API

## Metadata

The metadata transformer provides a similar mechanism to component/content-meta however it relies upon a static configuration in the config API instead to render meta tags. Like its component counterpart it may not actually be in use. ( Check stats )

## SPP API

Like the Fatwire endpoint this provides transparent integration with the custom Wordpress fragments API implemented by the SPP team.

## Video

The video endpoint is nothing special but it's not part of CAPI either despite using the the same host. It's used to fetch video categories.

# /views

All views ideally should be externalised from tcog, those that currently remain are legacy. I highly recommend reviewing the template stats to determine which templates can be successfully deprecated.

- http://logstash.ni.news.com.au//index.html#/dashboard/elasticsearch/Unknown%20TCOG%20Templates
- http://logstash.ni.news.com.au//index.html#/dashboard/elasticsearch/tcog%20Template%20Performance%20autogen

## Common

The Australian has its own folder in common. Odd. ( Added before we supported external templates )

## Article

Default basic article template

## Core

## Layouts

## Video

Video specific templates. Added again before we supported external templates
