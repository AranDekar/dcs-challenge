## Akamai

All users should be user the Akamai endpoint of tcog. An Akamai endpoint is denoted by `a.` in the hostname eg `a.tcog.news.com.au`. The only time the origin host is used is between Akamai and tcog.

ESI processing of fragments is turned off by defualt. It has to be explicitly opted into by appending the `esi=true` param.

eg:

```
origin : http://tcog.news.com.au/component/article/dailytelegraph/desktop/newslocal/inner-west/westconnex-richard-moras-fed-up-with-workers-wrongly-identifying-his-st-peters-house-to-be-demolished/news-story/3e92c0fd276f5108fd353694e42f0585?t_product=DailyTelegraph&t_template=s3/chronicle-templaterouter/index
akamai : http://a.tcog.news.com.au/component/article/dailytelegraph/desktop/newslocal/inner-west/westconnex-richard-moras-fed-up-with-workers-wrongly-identifying-his-st-peters-house-to-be-demolished/news-story/3e92c0fd276f5108fd353694e42f0585?t_product=DailyTelegraph&t_template=s3/chronicle-templaterouter/index
esi    : http://a.tcog.news.com.au/component/article/dailytelegraph/desktop/newslocal/inner-west/westconnex-richard-moras-fed-up-with-workers-wrongly-identifying-his-st-peters-house-to-be-demolished/news-story/3e92c0fd276f5108fd353694e42f0585?t_product=DailyTelegraph&t_template=s3/chronicle-templaterouter/index&esi=true
```

### Integrations ( routing )

Sites can integrate with tcog in one of two ways, as above with tcog fragments or via an origin mapping. An origin mapping is where a site offloads the responsibility for processing a request to an external service.

Within our network we have origin mappings for metros, regionals and nationals which direct traffic for articles and galleries to tcog.

For a site to integrate in this way the following information is required by tcog in-order for tcog to permit access.

- **x-tcog-template** : the remote template to user
- **x-tcog-product** : the tcog product name

> Note these are request headers and are equivalent to t_product & t_template

In addition to this, the tcog host is required. This may be different depending upon the environment you are integrating with and an origin base path. The origin base path relates to the default path to the origin host eg: "/component/article".

Rules are the applied to determine when this routing should occur. For example

- /news-story/* : if the requests if of type article
- /image-gallery/* : if the requests if of type gallery
- /story-*-* : legacy article urls
- /(photos|gallery)-*-* : legacy gallery urls

**Examples**

```
- http://www.news.com.au/world/north-america/trump-to-oreilly-i-dont-know-if-obama-will-admit-this/news-story/a5d640220809d9866309d3054c5cfacf
- http://www.dailytelegraph.com.au/entertainment/inside-starstudded-super-bowl-2017/image-gallery/8ffdcd0e34986a70939649bc13d7eea5
- http://www.couriermail.com.au/business/companies/fortescue-metals-restructures-rosters-for-pilbara-mine-workers/story-fnkjk9kn-1227303003498
```
Akamai will forward request in all cases to tcog as follows.

`tcog.news.com.au/component/article/<request-path>?<request-querystring>`

**Note gallery uses the same endpoint as article - there is no difference between them**

### Debugging

Akamai provides a debug console for testing urls which are Akamai enabled and may also contain nested fragments.

Often you may need to help teams debug why a tcog url is not working when it is ESI'd into a page.

1. Visit https://fed3.news.net.au/adfs/ls/idpinitiatedsignon.aspx
2. Select "Akamai Luna Portal" from drop down
3. Visit https://newscomau.luna-sp.com/portal/esid_2.jsp

The debug portal has the following options

- **URL to Debug** : the url you need to test ( www.news.com.au/... or a.tcog.news.com.au )

Most environments are configured to work with Akamai.

- **Client Request Headers** : additional headers needed to access the page

The following additional headers are required in-order to correctly debug pages on our network.

```
ndmesidebug:654321
Cookie: nk=anything; n_regis=anything; n_rme=anything; open_token=anonymous; sr=true
```

ndmesidebug is need to bypass IP restrictions that some urls may have in place and the Cookie header is needed to force a paywall bypass.

ESI Developer Guide : https://www.akamai.com/us/en/multimedia/documents/technical-publication/akamai-esi-developers-guide-technical-publication.pdf

#### Debug Headers Extension

This extension makes it possible to inpect information Akamai knows about a request it received such as how it has been cached, for how long and which ghost server processed it.

See video/akamai-headers.mp4 for more detail.

https://chrome.google.com/webstore/detail/akamai-debug-headers/lcfphdldglgaodelggpckakfficpeefj?hl=en

#### Debugging config changes

An Akamai config can be deployed to two networks. A staging network where you can conduct testing prior to a production deployment and the production network.

Depending upon the change made you may be able to verify using the Debug Headers Extension alone. Should this not be possible you may have to resort to using curl.

In either scenario you will need to ensure that the host you are attempting to connect to is correctly routed via the staging network.

```
curl -c cookiejar -L --resolve <host>:<staging-network-ip> <url-to-test>
```
> testing via curl

```
curl -c cookiejar -L --resolve a.tcog.news.com.au:80:23.50.63.24 http://a.tcog.news.com.au/healthcheck\?t_product\=newscomau
curl -c cookiejar -L --resolve www.news.com.au:80:23.50.63.24 http://www.news.com.au/world/north-america/donald-trump-to-order-temporary-ban-refugees/news-story/9423d195c14da764324f16929281f9a1
```
> curl examples

#### Advanced ( experimental )

An advanced debug capability is available using a local dockerised version of Akamais testing server ETS.

See : http://stash.news.com.au/projects/TCOG/repos/akamai-ets/browse
