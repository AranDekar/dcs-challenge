# TCOG API
## Wordpress integration

The following endpoints integrate with the Wordpress API explained at `https://newscorpauapi.docs.apiary.io/#reference/endpoints`.

This TCOG endpoint was originally a 1.0 transformer but has been refactored in the newer style - with less internal abstractions and more reliance on open source Express.js conventions.

SPP is the Platform for hosting Wordpress.

<aside class="notice">
Any call into SPP API that carries a URI parameter giving away the SPP API key is considered insecure and dangerous.

The security risk is that, if discovered, the API key could be used to steal our content - e.g. the pages call.

The performance risk is that some calls using the API key, particularly pages, can block and slow down production Wordpress instances.

As of late April, 2018, the decision to deprecate any SPP-API call that involves passing an spp_api_key URI parameter has been made. This will happen after the Broadsheet theme in The Australian has gone to production.
</aside>

### GET Page(s) from Wordpress

This query returns a JSON representation of pages in Wordpress. Any plain URI parameters, not preceded with a `t_` prefix, are passed to Wordpress.

Example TCOG URL:

`http://a.tcog.news.com.au/spp-api/v1/pages/?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&spp_api_pagename=story/budget-2017&t_product=tcogaustralian&t_domain=theaustralian.com.au&t_contentType=application/json&td_pagepos=main-content-mobile&td_myprimarycategory=budget-2017&td_mysecondarycategory=primary-category-only&td_startcount=0&td_stopcount=999&t_template=s3/austemp-article_common/vertical/spp-widgets`

This call will be deprecated soon due to the security risk explained above.

### GET a rendered template from Wordpress

Render a Wordpress template and returns its HTML.

Example TCOG URL:

`http://a.tcog.news.com.au/spp-api/v1/template/?path=components.footer.footer&t_product=tcog&domain=townsvillebulletin.com.au&w_isArticle=true`

### Widget

Wordpress supports three different widget calls:

1) Get Widget as JSON
2) Get Widget as HTML
3) Get public widget as HTML

TCOG provides two endpoints to service these endpoints.

#### Public Widget

Use the public API to render a Wordpress widget as HTML.

Example TCOG URL:

`http://a.tcog.news.com.au/spp-api/v1/widgets/public/newscorpau_static_template-652/?widgetID=newscorpau_static_template-652&product=tcog`


#### Widget, as HTML or JSON

`http://a.tcog.news.com.au/spp-api/v1/widgets/newscorpau_reference_widget-228?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&t_product=tcog`
`http://a.tcog.news.com.au/spp-api/v1/widgets/newscorpau_reference_widget-228?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&t_product=tcog&format=html`


### Query Parameters

Parameter | Default | Description
--------- | ------- | -----------
format | json | If set to `html` the result will be HTML.