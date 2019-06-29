The following endpoints integrate with the Wordpress API explained at https://newscorpauapi.docs.apiary.io/#reference/endpoints.

This TCOG endpoint was originally a 1.0 transformer but has been refactored in the newer style - with less internal abstractions and more reliance on open source Express.js conventions.

SPP is the Platform for hosting Wordpress.

## Security Considerations

Understanding the SPP-API endpoint between TCOG and Wordpress means understanding the history of a security issue.

Any call into SPP API that carries a URI parameter giving away the SPP API key is considered insecure and dangerous.

The security risk is that, if discovered, the API key could be used to steal our content - e.g. the pages call.

The performance risk is that some calls using the API key, particularly pages, can block and slow down production Wordpress instances.


### Pages

http://localhost:3000/spp-api/v1/pages/?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&spp_api_pagename=story/budget-2017&t_product=the-australian&t_domain=theaustralian.com.au&t_contentType=application/json&td_pagepos=main-content-mobile&td_myprimarycategory=budget-2017&td_mysecondarycategory=primary-category-only&td_startcount=0&td_stopcount=999&t_template=s3/austemp-article_common/vertical/spp-widgets

### Template

http://tcog:3000/spp-api/v1/template/?path=components.footer.footer&t_product=TownsvilleBulletin&domain=townsvillebulletin.com.au&w_isArticle=true

/spp-api/v1/template/?path=components.header.header&t_product=CourierMail&domain=couriermail.com.au&w_section=news/national&w_device=mobile

### Widget

Wordpress supports three different widget calls:

1) Get Widget as JSON
2) Get Widget as HTML
3) Get public widget as HTML

One 'widget' endpoint supports all of these calls in TCOG. Interpreting the intial request to determine which Wordpress endpoint to call.

Example queries:

1) /spp-api/v1/widgets/newscorpau_reference_widget-228?spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&t_product=the-australian

2) /spp-api/v1/widgets/newscorpau_ads-877/?format=html&spp_api_key=XuE5eOv3o2Wa4WcljO6E3aQVo8rkmgUVthUN6TtOg-Y&t_product=the-australian

3) /spp-api/v1/widgets/public/newscorpau_static_template-652/?widgetID=newscorpau_static_template-652&product=newscomau

https://newscorpauapi.docs.apiary.io/#reference/endpoints/widgets/get-widget-as-html

/spp-api/v1/widgets/public/newscorpau_static_template-655/?widgetID=newscorpau_static_template-655&product=newscomau