FORMAT: 1A HOST: http://tcog.news.com.au

TCOG API
========

> "More than meets the eye."

[TCOG](http://tcog.news.com.au/) is a transformation tier for consuming various content sources and delivering templates.

URL Organisation
----------------

URLs are split into two types - 1 to 1 Mappings with an existing API and TCOG components written to solve more specialised problems.

Currently there are 1 to 1 Mappings to the Content and Config API. To learn more about these APIs access the IO Docs at http://developer.news.com.au/.

### 1 to 1 Mappings URL Structure

"1 to 1" Mappings mimick the URLs of the API they are modelled after, except they are preceded by a URI part indicating who owns the URL.

For example `http://tcog.news.com.au/news/content/v1/?t_product=tcog` mirrors the call to `http://cdn.newsapi.com.au/content/v1/?api_key=XYZ123` except that it has a name for the owner of the URL.

This is a foresight for when we need TCOG to sit before other APIs.

TCOG passes on every URI parameter, except those prefixed with `t_` (eg: t_product), to the downstream endpoint.

### Product Identifiers

TCOG URLs use a `t_product` URI parameter. TCOG internally keeps a configuration key-value store that is used to look up required data for the service TCOG is calling. In the context of using the Content API, `t_product=tcog` will mean that TCOG can look up the Content API and Image API keys configured for the tcog product that are required by the downstream API.

The product also specifies who should be contacted if an error occurs. Notifications are conveyed via [Opsgenie](http://www.opsgenie.com/).

The first step toward using TCOG is to arrange to have a TCOG Product Identifier created. See http://wiki.news.com.au/display/FE/Setting+up+a+product.

### TCOG Components

Components live under the /component/ namespace in the URI. They also require a `t_product` identifier.

Components are customised endpoints that solve specific problems not met by downstream APIs.

### URI Parameters

TCOG uses any URI parameter that begins with the `t_`, `tc_` and `td_` prefixes. These parameters are removed from the downstream request to the API TCOG fronts. Any other URI parameter will be passed along.

-	`t_` - top level tcog options
-	`tc_` - signifies anything to do with a config
-	`td_` signifies anything to do with display overrides

TCOG has a variety of URI parameters that operate to produce various effects suchs as:

-	toggling on specific parts of templates (whether to show a title, a standfirst, etc.)
-	indicating which template to use (the `t_template` parameter)
-	which css classes or pieces of text to use (all text is sanitized before appearing in a template)

Unless overridden by `t_template` the default template is usually 'extended'.

General layout templates:

-	extended
-	compact - breaking news
-	compact-ol - plain ordered list of news
-	compact-ul - plain unordered list of news
-	imageblock - regular thumbnail view

Footer templates:

-	popular-combined-footer
-	popular-footer
-	popular-headline
-	popular-plain

Customised templates for specific purposes can be produced. For example, one was made for The Australian's 50th.

### Deprecated Parameters

TCOG has deprecated earlier `display:` style variables (the colon character isn't legal for URI Parameters). TCOG URLs holding these URI parameters will still function, however.

Group Content API 1 to 1 Mappings
=================================

Search [/news/content/v1/{?t_product,t_template,td_module_header,td_timestamp,td_dateformat,td_standfirst,td_byline,td_date_header,td_kicker,td_thumbnail,td_imagewidth,td_imageheight}]
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TCOG endpoint fronting Content API's generic search.

-	Parameters

	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	t_template (optional, string, `compact`) ... Defaults to `extended` ... Template required to render output

		-	Values
			-	`compact`
			-	`compact-ol`
			-	`compact-ul`
			-	`extended`
			-	`imageblock`
			-	`popular-combined-footer`
			-	`popular-footer`
			-	`popular-headline`
			-	`popular-plain`

	-	td_module_header (optional, string, `t_module_header=Business+and+Finance`) ... text that defines the header for the placement (for instance, Business and Finance).

	-	td_timestamp = `true` (optional, boolean, `t_timestamp=false`) ... whether the timestamp is visible on each story block.

	-	td_dateformat = `H:mm A or dddd, D MMMM` (optional, string) ... A [moment.js format pattern](http://momentjs.com/docs/#/displaying/) for dates. Defaults to `H:mm A` for the `extended` template and `dddd, D MMMM` for `imageblock`.

	-	td_standfirst = `false` (optional, boolean) ... whether the standfirst is visible on each story block.

	-	td_byline = `false` (optional, boolean) ... the byline is visible on each story block. Note that the byline being visible is dependent on `t_standfirst=true`.

	-	td_kicker = `true` (optional, boolean) ... whether the kicker is visible on each story block.

	-	td_date_header = `false` (optional, boolean) ... whether to display a date header for items returned. Note that the date header is not duplicated so the content effectively appears grouped by date

	-	td_thumbnail = `true` (optional, boolean) ... whether the thumbnail is visible on each story block.

	-	td_imagewidth (optional, number) ... positive number describing the width (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

	-	td_imageheight (optional, number) ... positive number describing the height (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

### GET Notes [GET]

```http
http://tcog.news.com.au/news/content/v1/?t_product=tcog
```

-	Response 200 (text/html)

	-	Body

		```
		<div class="module ">
		  <div class="module-content">
		    <div class="content-item cipos-0 cirpos-58">
		      <div id="93e41fc57339ce7656cc9274e7871065" class="story-block sbpos-0 sbrpos-58">
		        <h4 class="heading"><a>Steve 'Blocker' Roach on Tigers young guns, Benji return</a></h4>
		      </div>
		    </div>
		    <div class="content-item cipos-1 cirpos-57">
		      <div id="87516ba239ec241c35b6e9fa5680fe66" class="story-block sbpos-1 sbrpos-57">
		        <h4 class="heading"><a>House blaze</a></h4>
		      </div>
		    </div>
		    <!-- ... omitting most of the HTML -->
		    <div class="content-item cipos-56 cirpos-2">
		      <div id="2bc192a2da64f72bed3396057a42b98a" class="story-block sbpos-56 sbrpos-2">
		        <h4 class="heading"><a>'I never doped'</a></h4>
		      </div>
		    </div>
		    <div class="content-item cipos-57 cirpos-1">
		      <div id="2bc192a2da64f72bed3396057a42b98a" class="story-block sbpos-57 sbrpos-1">
		        <h4 class="heading"><a>'I never doped'</a></h4>
		      </div>
		    </div>
		  </div>
		</div>
		```

Retrieve [/news/content/v1/{id}/{?t_product,t_template,td_module_header,td_timestamp,td_dateformat,td_standfirst,td_byline,td_date_header,td_kicker,td_thumbnail,td_imagewidth,td_imageheight}]
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TCOG call to Content API /content/v1/:id. Except for the id parameter, this call is identical to the search function above.

-	Parameters

	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	t_template (optional, string, `compact`) ... Defaults to `extended` ... Template required to render output

		-	Values
			-	`compact`
			-	`compact-ol`
			-	`compact-ul`
			-	`extended`
			-	`imageblock`
			-	`popular-combined-footer`
			-	`popular-footer`
			-	`popular-headline`
			-	`popular-plain`

	-	td_module_header (optional, string, `t_module_header=Business+and+Finance`) ... text that defines the header for the placement (for instance, Business and Finance).

	-	td_timestamp = `true` (optional, boolean, `t_timestamp=false`) ... whether the timestamp is visible on each story block.

	-	td_dateformat = `H:mm A or dddd, D MMMM` (optional, string) ... A [moment.js format pattern](http://momentjs.com/docs/#/displaying/) for dates. Defaults to `H:mm A` for the `extended` template and `dddd, D MMMM` for `imageblock`.

	-	td_standfirst = `false` (optional, boolean) ... whether the standfirst is visible on each story block.

	-	td_byline = `false` (optional, boolean) ... the byline is visible on each story block. Note that the byline being visible is dependent on `t_standfirst=true`.

	-	td_kicker = `true` (optional, boolean) ... whether the kicker is visible on each story block.

	-	td_date_header = `false` (optional, boolean) ... whether to display a date header for items returned. Note that the date header is not duplicated so the content effectively appears grouped by date

	-	td_thumbnail = `true` (optional, boolean) ... whether the thumbnail is visible on each story block.

	-	td_imagewidth (optional, number) ... positive number describing the width (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

	-	td_imageheight (optional, number) ... positive number describing the height (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

### Get Notes [GET]

```http
http://tcog.news.com.au/news/content/v1/17d8cb2f5077fc8284cb3e6464769c8d?t_product=tcog
```

-	Response 200 (text/html)

	-	Body

		```
		<div class="module ">
		  <div class="module-content">
		    <div class="content-item cipos-0 cirpos-58">
		      <div id="93e41fc57339ce7656cc9274e7871065" class="story-block sbpos-0 sbrpos-58">
		        <h4 class="heading"><a>Steve 'Blocker' Roach on Tigers young guns, Benji return</a></h4>
		      </div>
		    </div>
		    <div class="content-item cipos-1 cirpos-57">
		      <div id="87516ba239ec241c35b6e9fa5680fe66" class="story-block sbpos-1 sbrpos-57">
		        <h4 class="heading"><a>House blaze</a></h4>
		      </div>
		    </div>
		    <!-- ... omitting for brevity -->
		    <div class="content-item cipos-56 cirpos-2">
		      <div id="2bc192a2da64f72bed3396057a42b98a" class="story-block sbpos-56 sbrpos-2">
		        <h4 class="heading"><a>'I never doped'</a></h4>
		      </div>
		    </div>
		    <div class="content-item cipos-57 cirpos-1">
		      <div id="2bc192a2da64f72bed3396057a42b98a" class="story-block sbpos-57 sbrpos-1">
		        <h4 class="heading"><a>'I never doped'</a></h4>
		      </div>
		    </div>
		  </div>
		</div>
		```

Retrieve Collection [/news/content/v1/collection/{id}/{?t_product,t_template,td_module_header,td_timestamp,td_dateformat,td_standfirst,td_byline,td_date_header,td_kicker,td_thumbnail,td_imagewidth,td_imageheight}]
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TCOG call to Content API /content/v1/collection/:id.

-	Parameters

	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	t_template (optional, string, `compact`) ... Defaults to `extended` ... Template required to render output

		-	Values
			-	`compact`
			-	`compact-ol`
			-	`compact-ul`
			-	`extended`
			-	`imageblock`
			-	`popular-combined-footer`
			-	`popular-footer`
			-	`popular-headline`
			-	`popular-plain`

	-	td_module_header (optional, string, `t_module_header=Business+and+Finance`) ... text that defines the header for the placement (for instance, Business and Finance).

	-	td_timestamp = `true` (optional, boolean, `t_timestamp=false`) ... whether the timestamp is visible on each story block.

	-	td_dateformat = `H:mm A or dddd, D MMMM` (optional, string) ... A [moment.js format pattern](http://momentjs.com/docs/#/displaying/) for dates. Defaults to `H:mm A` for the `extended` template and `dddd, D MMMM` for `imageblock`.

	-	td_standfirst = `false` (optional, boolean) ... whether the standfirst is visible on each story block.

	-	td_byline = `false` (optional, boolean) ... the byline is visible on each story block. Note that the byline being visible is dependent on `t_standfirst=true`.

	-	td_kicker = `true` (optional, boolean) ... whether the kicker is visible on each story block.

	-	td_date_header = `false` (optional, boolean) ... whether to display a date header for items returned. Note that the date header is not duplicated so the content effectively appears grouped by date

	-	td_thumbnail = `true` (optional, boolean) ... whether the thumbnail is visible on each story block.

	-	td_imagewidth (optional, number) ... positive number describing the width (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

	-	td_imageheight (optional, number) ... positive number describing the height (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

### Get Notes [GET]

```http
http://tcog.news.com.au/news/content/v1/collection/892fcb0f9febf97319ba00e400ae5e5e?t_product=tcog&pageSize=20&offset=0
```

-	Response 200 (text/html)

	-	Body

		```
		<div class="module module-content">
		    <div class=
		    "content-item cipos-0 cirpos-20 story-block sbpos-0 sbrpos-20" id=
		    "b76d439ac71170e1d207bd24295fea80">
		        <h4 class="heading"><span class="kicker">Politics</span><a href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/bob-hawke/story-fnnk86em-1226977948953?sv=5012dbb9e10f745cdf2a849c87023f03">Bob
		        Hawke</a></h4><a class="thumb-link" href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/bob-hawke/story-fnnk86em-1226977948953?sv=5012dbb9e10f745cdf2a849c87023f03"><img alt="Bob Hawke in 1991."
		        class="thumbnail" height="75" src=
		        "http://api.news.com.au/content/1.0/theaustralian/images/1226977949068?format=jpg"
		        width="100"></a>


		        <p class="standfirst"><span>Robert James Lee Hawke had a streak of
		        larrikinism that endeared him to many Australians</span></p>
		    </div>


		    <div class=
		    "content-item cipos-1 cirpos-19 story-block sbpos-1 sbrpos-19" id=
		    "167e9ed3bbf82302679356e51ea99b24">
		        <h4 class="heading"><span class="kicker">Media</span><a href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/rupert-murdoch/story-fnnk86em-1226978165444?sv=5e38819e55d2e391886832be59cd4235">Rupert
		        Murdoch</a></h4><a class="thumb-link" href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/rupert-murdoch/story-fnnk86em-1226978165444?sv=5e38819e55d2e391886832be59cd4235"><img alt="Rupert Murdoch photographed in the 1970’s."
		        class="thumbnail" height="75" src=
		        "http://api.news.com.au/content/1.0/theaustralian/images/1226978165873?format=jpg"
		        width="100"></a>


		        <p class="standfirst"><span>Tycoon From Down Under Takes On The
		        World.</span></p>
		    </div>


		    <!-- ... omitting for brevity -->


		    <div class=
		    "content-item cipos-18 cirpos-2 story-block sbpos-18 sbrpos-2" id=
		    "f4783a15b558d27d1fef81784a477b3a">
		        <h4 class="heading"><span class="kicker">The
		        Innovators</span><a href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/ian-frazer/story-fnnk86em-1226982045562?sv=3798a79eafb62d2a59f4fff1fc15cc42">Ian
		        Frazer</a></h4><a class="thumb-link" href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/ian-frazer/story-fnnk86em-1226982045562?sv=3798a79eafb62d2a59f4fff1fc15cc42"><img alt="Ian Frazer"
		        class="thumbnail" height="75" src=
		        "http://api.news.com.au/content/1.0/theaustralian/images/1226982045107?format=jpg"
		        width="100"></a>


		        <p class="standfirst"><span>God’s gift to women</span></p>
		    </div>


		    <div class=
		    "content-item cipos-19 cirpos-1 story-block sbpos-19 sbrpos-1" id=
		    "4d57e1bb4787f7fe019bd428965acbdd">
		        <h4 class="heading"><span class="kicker">Business</span><a href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/lang-hancock-gina-rinehart/story-fnnk86em-1226982002225?sv=c79a9f82b29d77514d4cb8f8c470e12c">Lang
		        Hancock &amp; Gina Rinehart</a></h4><a class="thumb-link" href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/lang-hancock-gina-rinehart/story-fnnk86em-1226982002225?sv=c79a9f82b29d77514d4cb8f8c470e12c"><img alt="Hancock, left, with Gina and her first husband, Greg Hayward, who changed his surname fro"
		        class="thumbnail" height="75" src=
		        "http://api.news.com.au/content/1.0/theaustralian/images/1226982003974?format=jpg"
		        width="100"></a>


		        <p class="standfirst"><span>All real wealth is in the ground, and
		        societies become prosperous only by exploiting that
		        wealth</span></p>
		    </div>
		</div>
		```

Group Config API Mapping
========================

This behaviour is a 1 to 1 mapping to the Content API.

Config [/news/config/conf{?t_product,tc_key,td_title,td_meta,td_link,td_vars,td_getvar}]
----------------------------------------------------------------------------------------

A mapping to the Config API. Arbitrary JSON can be stored here, mostly for use in the HEAD element of a HTML document.

Note, this query is silent by default. You must specify which parts of the JSON clause you wish to see by toggling on the boolean. For example, `&tc_vars=true` would mean that the `metadata` template would output Javascript variables.

Speak to a TCOG team member for more information.

-	Parameters
	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	tc_key (required, string, `capability.newslocal`) ... The identifier for the top level of JSON held in the Config API
	-	td_title = `false` (optional, boolean) ... Display the title
	-	td_meta = `false` (optional, boolean) ... Display meta information
	-	td_link = `false` (optional, boolean) ... Display links
	-	td_vars = `false` (optional, boolean) ... Display Javascript variables
	-	td_getvar = `false` (optional, boolean) ... Display unescaped raw output of a Javascript variable

### Get Notes [GET]

```http
http://tcog.news.com.au/metadata/?t_product=capability&tc_key=capability.newslocal&tc_vars=true&tc_meta=true&t_link=true&tc_subkey=mosman-daily&t_title=true
```

-	Response 200 (text/html)

	-	Body

		```
		<head>
		    <title>Mosman Daily | Local Community News NSW |
		    dailytelegraph.com.au</title>
		    <meta content=
		    "Read the latest news from the Mosman Daily and many more Sydney Local Newspapers online"
		    name="description">
		    <meta content=
		    "Mosman Daily, NewsLocal Newspapers, Local Community News, NSW News, NewsLocal, News, Mosman, Daily"
		    name="keywords">
		    <meta content="100002324295212">
		    <meta content="summary" name="twitter:card">
		    <meta content="@dailytelegraph" name="twitter:site">
		    <meta content="@dailytelegraph" name="twitter:site:id">
		    <link href="http://www.dailytelegraph.com.au/newslocal/mosman-daily/" rel=
		    "canonical">
		    <script type="text/javascript">
		        var overridePageSection = "LOCAL.MANLY-DAILY";var customFacebook = "/mosmandaily";var customTwitter = "MosmanDaily";var customTwitterId = "472162894797221888";var customEventRegion = "NSW North Shore";var overridePageTitle = "Mosman News";var localBodyClass = "mosman-daily";
		    </script>
		</head>
		```

Group TCOG Components
=====================

TCOG Components are specialised endpoints that handle more complicated scenarios.

Popular Combined [/component/popular-combined/{?t_product,t_domain,td_primary_bound,t_template,td_timestamp,td_dateformat,td_standfirst,td_byline,td_kicker,td_date_header,td_thumbnail,td_imagewidth,td_imageheight,td_module_header}]
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Allows for a footer list featuring a list of popular news for a primary masthead along with secondary ones.

Popular news lists appear in the order of domains specified by `t_domain`. The number of articles in the primary is customizable by `t_primary_bound`. The secondary lists each have a maximum length of 5.

-	Parameters

	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	t_domain (required, string, `t_domain=dailytelegraph.com.au,news.com.au,theaustralian.com.au`) ... The list of domains to combine for the popular lists. The first domain's length is controlled by `t_primary_bound`
	-	td_primary_bound (optional, number) ... Number of articles to show in the primary masthead list.
	-	t_template (optional, string, `compact`) ... Defaults to `popular-combined-footer` ... Template required to render output

		-	Values
			-	`compact`
			-	`compact-ol`
			-	`compact-ul`
			-	`extended`
			-	`imageblock`
			-	`popular-combined-footer`
			-	`popular-footer`
			-	`popular-headline`
			-	`popular-plain`

	-	td_module_header (optional, string, `t_module_header=Business+and+Finance`) ... text that defines the header for the placement (for instance, Business and Finance).

	-	td_timestamp = `true` (optional, boolean, `t_timestamp=false`) ... whether the timestamp is visible on each story block.

	-	td_dateformat = `H:mm A or dddd, D MMMM` (optional, string) ... A [moment.js format pattern](http://momentjs.com/docs/#/displaying/) for dates. Defaults to `H:mm A` for the `extended` template and `dddd, D MMMM` for `imageblock`.

	-	td_standfirst = `false` (optional, boolean) ... whether the standfirst is visible on each story block.

	-	td_byline = `false` (optional, boolean) ... the byline is visible on each story block. Note that the byline being visible is dependent on `t_standfirst=true`.

	-	td_kicker = `true` (optional, boolean) ... whether the kicker is visible on each story block.

	-	td_date_header = `false` (optional, boolean) ... whether to display a date header for items returned. Note that the date header is not duplicated so the content effectively appears grouped by date

	-	td_thumbnail = `true` (optional, boolean) ... whether the thumbnail is visible on each story block.

	-	td_imagewidth (optional, number) ... positive number describing the width (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

	-	td_imageheight (optional, number) ... positive number describing the height (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

### Get Notes [GET]

```http
http://tcog.news.com.au/component/popular-combined?t_product=tcog&t_domain=dailytelegraph.com.au,news.com.au,theaustralian.com.au&t_primaryBound=12
```

-	Response 200 (text/html)

	-	Body

		```
		<div class="module module-content content-item most-popular-articles">
		    <div class="ci-header">
		        <h4 class="heading">Today's Most Popular Articles</h4>
		    </div>


		    <div class="most-pop-item most-pop-major most-pop-daily-telegraph">
		        <div class="mpi-header">
		            <h5 class="heading"><a href="http://dailytelegraph.com.au">The
		            Daily Telegraph</a></h5>
		        </div>


		        <ol>
		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/news/the-face-of-future-sydney-forms-the-worlds-greatest-waterfront-is-taking-shape-as-barangaroo-rises/story-fnii5s3y-1227005013213?sv=4e45ee5f31e5cc7ddcdad2ed3a3c3741">
		                The face of future Sydney forms</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/news/nsw/tears-and-tragedy-as-boy-6-hit-and-killed-by-car-in-hurstville/story-fni0cx12-1227004892186?sv=ec0df7c4453c9013edf5ae6dcd321177">
		                We begged for safer parking: Dead boy’s teacher claims</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/news/national/phil-kearns-says-the-supremacy-of-scots-college-is-dreadful-for-rugby-after-1010-drubbing-of-newington-colleg/story-fnii5s40-1227003526800?sv=6dcdfc6f976cbc3a2ea6c6031fdd3b06">
		                Scots supremacy ‘dreadful’, says Kearns</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/news/asylum-seeker-case-collapses-due-to-the-governments-move-to-bring-them-to-the-mainland/story-fnii5s41-1227004945972?sv=ca2247d7aef86b3172d09213ca50a8cf">
		                Asylum seeker case collapses in court</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/sport/nrl/wests-tigers-coach-mick-potter-and-captain-robbie-farah-in-damage-control/story-fni3gpyw-1227004949620?sv=2c1702677780d41ec6cf62f467c37a55">
		                Tigers in damage control over pot shots</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/sport/nrl/south-sydney-rabbitohs-stars-sam-burgess-and-john-sutton-injured-in-win-over-canberra/story-fniabjd2-1227004638426?sv=f043d0e0f2643ec3464c71839d89a7e1">
		                Win soured with Burgess, Sutton injured</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/sport/nrl/gorden-tallis-says-he-wont-cop-being-called-a-liar-by-wests-tigers-skipper-robbie-farah/story-fniabr47-1227004888395?sv=bb5cd95e4c61b1e014fcacb0e190ad7b">
		                No one calls me a liar, says Gordie</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/news/nsw/disgraced-former-speaker-peter-slipper-faces-five-years-jail-for-dishonesty-sentencing-will-occur-on-september-22/story-fni0cx12-1227004945412?sv=f4634cec38f5416a613f49b3dea3d79">
		                Slipper’s $157k-a-year pension could go</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/national/nsw-act/now-that-was-a-sunset-sydneys-cloth-of-gold-was-simply-special/story-fnii5s3x-1227004740149?sv=73da352e2322979e6bfcc4d2f5e252e1">
		                Now, that was a sunset!</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/sport/nrl/gorden-talliss-feud-with-robbie-farah-makes-sense-for-man-who-sees-life-in-black-and-white/story-fniabkse-1227004774088?sv=ec75eeb2ab9173bd6301ebb65479d030">
		                Tallis known for shooting from the hip</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/travel/travel-news/qantas-pilots-fear-missiles-over-iraq-but-costly-diversions-over-wartorn-country-rejected/story-fnjjv9zj-1227004993711?sv=a07a268609acfec431099af36a4f647f">
		                Qantas pilots fear missiles over Iraq</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.dailytelegraph.com.au/news/marrickvilles-post-cafe-damaged-by-fire-for-second-time-in-12-months/story-fnii5s3z-1227005140730?sv=9c49af24b0ef9b3b51f1db7b0036f494">
		                Sydney cafe blaze a case of déjà vu</a>
		            </li>
		        </ol>
		    </div>


		    <div class="most-pop-item most-pop-standard most-pop-news-com-au">
		        <div class="mpi-header">
		            <h5 class="heading"><a href=
		            "http://news.com.au">News.com.au</a></h5>
		        </div>


		        <ol>
		            <li>
		                <a href=
		                "http://www.news.com.au/entertainment/television/masterchef-secrets-what-you-didnt-know-about-tens-cooking-show/story-fni0cjvk-1227004773312?sv=da59e276540f70ee4a1826b717c8096a"
		                rel="track-mostpopfooter">The truth behind the scenes at
		                Masterchef</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.news.com.au/travel/travel-news/delta-pilots-rant-at-air-traffic-controller-at-atlanta-airport-audio-leaked/story-fni0biep-1227005262968?sv=7e415fec5636c2ac651c3de67996e599"
		                rel="track-mostpopfooter">Pilot’s hissy fit at air traffic
		                control</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.news.com.au/technology/illegal-downloading-in-governments-sights-as-online-copyright-infringement-discussion-paper-takes-aim-at-consumers-isps/story-fnjwnvrz-1227004467973?sv=73543fae862df5503c56858004a4d444"
		                rel="track-mostpopfooter">The end of the free download?</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.news.com.au/more-sports/sabina-altynbekova-the-kazakhstan-volleyballer-too-beautiful-for-sport/story-e6frf56c-1227005448136?sv=c1d9cf9f1ff97497512a097e4b44c733"
		                rel="track-mostpopfooter">The girl too beautiful for
		                sport</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.news.com.au/lifestyle/cannibals-creepiest-modernday-human-flesh-eaters/story-fnixw28e-1227005018460?sv=321106ed792472245f328a1588d600b2"
		                rel="track-mostpopfooter">The creepiest modern-day
		                cannibals</a>
		            </li>
		        </ol>


		        <p class="most-pop-more-link"><a href="http://news.com.au">View
		        News.com.au</a></p>
		    </div>


		    <div class="most-pop-item most-pop-standard most-pop-the-australian">
		        <div class="mpi-header">
		            <h5 class="heading"><a href="http://theaustralian.com.au">The
		            Australian</a></h5>
		        </div>


		        <ol>
		            <li>
		                <a href=
		                "http://www.theaustralian.com.au/national-affairs/policy/scott-morrison-says-any-claim-of-asylum-from-india-would-be-absurd/story-fn9hm1gu-1227003955714?sv=c5ff7b66f2e4c82c210213b4e8c533ac"
		                rel="track-mostpopfooter">Claim of asylum from India
		                ‘absurd’</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.theaustralian.com.au/national-affairs/policy/search-and-work-to-keep-the-dole/story-fn59noo3-1227003575905?sv=30b9d0c890fb07766e13ba5244070e35"
		                rel="track-mostpopfooter">Search and work to keep dole</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.theaustralian.com.au/opinion/columnists/greenhouse-follies-must-end/story-fn7078da-1227003409569?sv=88a3e49eeca5142f155f0adf2f93bc"
		                rel="track-mostpopfooter">Greenhouse follies must end</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.theaustralian.com.au/national-affairs/policy/coalition-hunt-for-union-links/story-fn59noo3-1227003574122?sv=833b9110dea2e8a379dfe356083316a2"
		                rel="track-mostpopfooter">Coalition hunt for union
		                links</a>
		            </li>


		            <li>
		                <a href=
		                "http://www.theaustralian.com.au/national-affairs/peter-slipper-found-guilty-of-dishonestly-using-taxi-vouchers/story-fn59niix-1227004701129?sv=1ba10c2b380298b096202198334fec28"
		                rel="track-mostpopfooter">Slipper guilty of taxi fraud</a>
		            </li>
		        </ol>


		        <p class="most-pop-more-link"><a href=
		        "http://theaustralian.com.au">View The Australian</a></p>
		    </div>
		</div>
		```

Article Component [/component/article/{fatwireSlug}{?t_product,t_template}]
---------------------------------------------------------------------------

Renders an article page based on an input fatwire slug (for example, world/bali-prisoner-stephen-henri-lubbe-writes-letter-saying-foreign-prisoners-buy-reduced-sentences-from-indonesian-jails/story-fndir2ev-1227014030151)

-	Parameters
	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	t_template (optional, string, `article`) ... Specify an optional alternate template

### Get Notes [GET]

```http
http://tcog.news.com.au/component/article/world/bali-prisoner-stephen-henri-lubbe-writes-letter-saying-foreign-prisoners-buy-reduced-sentences-from-indonesian-jails/story-fndir2ev-1227014030151?t_product=tcog
```

-	Response 200 (text/html)

	-	Body

		```
		<main>
		    <header>
		        <span class="kicker">Corruption claims</span>
		        <h1>
		            Bali prisoner Stephen Henri Lubbe writes letter
		            saying foreign prisoners buy reduced sentences from
		            Indonesian jails
		        </h1>
		        <p class="intro">
		            EXPLOSIVE new claims of corruption within Indonesia’s
		            legal system have been exposed by a foreign prisoner who
		            says he was offered a more lenient sentence for $US30,000.
		        </p>
		    </header>
		    <article>
		        <p>
		            South African Stephen Henri Lubbe was this week sentenced
		            to 15 years’ jail in Bali for drug smuggling, but said he
		            would have received far less had he coughed up the cash.
		        </p>
		        <p>
		            In a disturbing and dangerously frank two-page letter
		            obtained by News Corp, Lubbe claims “lucky foreigners”
		            from wealthy backgrounds are exchanging as much as $US120,000
		            for reduced sentences.
		        </p>
		        ...
		    </article>
		</main>
		```

Video [/component/video/{?t_product,td_host}]
---------------------------------------------

Returns ESI fragment for constructing the /video/* pages

-	Parameters
	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	td_host (required, string, `news.com.au`) ... Sets the Akamai HOSTNAME property via esi:assign

### Get Notes [GET]

```http
http://tcog.news.com.au/component/video?t_product=video&td_host=dailytelegraph.com.au
```

-	Response 200 (text/html)

	-	Body

		```xml
		<esi:assign name="HOSTNAME" value="'dailytelegraph.com.au'"></esi:assign>
		<esi:choose>
		    <esi:when test="$(AKA_PM_FWD_URL) matches_i '''^/[^/]+/id-([^/]+)'''" matchname="pathvars">
		        <esi:include src="http://tcog.news.com.au/news/content/v1/origin:video_integrator.$(pathvars{1})?t_product=video&td_site=$(site_name)&t_template=../video/video" dca="esi"></esi:include>
		        <esi:include src="http://tcog.news.com.au/search?t_product=video&t_template=../video/moduleSpecial&td_title=Most%20Popular&category=/video/$(HOSTNAME)/collection/popular-content/all/24hours&maxRelated=20&pageSize=20" onerror="continue"></esi:include>
		    </esi:when>
		    <esi:when test="$(AKA_PM_FWD_URL) matches_i '''^/[^/]+/playlist/(.*?)/?$'''" matchname="pathvars">
		        <esi:include src="http://tcog.news.com.au/news/content/v1/collection/?t_product=video&t_template=../video/playlist-pre-flight&subtitle=$(pathvars{1})&pageSize=1&offset=0" dca="esi" onerror="continue"></esi:include>
		    </esi:when>
		    <esi:when test="$(AKA_PM_FWD_URL) matches_i '''^/[^/]+/wsj/?$'''" matchname="pathvars">
		        <esi:include src="http://tcog.news.com.au/search?t_product=video&site=wsj&originalSource=WSJ%20Live&t_template=../video/banner&maxRelated=20&pageSize=5&offset=0" onerror="continue"></esi:include>
		        <esi:include src="http://tcog.news.com.au/news/content/v1/?t_product=video&td_site=wsj&originalSource=WSJ%20Live&site=wsj&t_template=../video/module&td_title=WSJ&td_root=wsj&td_list_style=block&maxRelated=20&pageSize=20" dca="esi" onerror="continue"></esi:include>
		    </esi:when><esi:when test="$(AKA_PM_FWD_URL) matches_i '''^/[^/]+/wsj/(.+?)/?$'''" matchname="pathvars">
		        <esi:include src="http://tcog.news.com.au/search?t_product=video&site=wsj&originalSource=WSJ%20Live&t_template=../video/banner&category=/video/video.news.com.au/$(pathvars{1})/&maxRelated=20&pageSize=5" onerror="continue"></esi:include>
		        <esi:include src="http://tcog.news.com.au/news/video/categories?t_product=video&site=wsj&td_originalSource=WSJ%20Live&td_site=wsj&t_template=../video/index&td_path=$(pathvars{1})&td_list_style=block" dca="esi" onerror="continue"></esi:include>
		    </esi:when>
		    <esi:when test="$(AKA_PM_FWD_URL) matches_i '''^/[^/]+/([^?]+?)/?$'''" matchname="pathvars">
		        <esi:include src="http://tcog.news.com.au/search?t_product=video&td_site=$(HTTP_HOST)&domain=$(site_name)&t_template=../video/banner&category=/video/video.news.com.au/$(pathvars{1})/&maxRelated=20&pageSize=5&offset=0" dca="esi"></esi:include>
		        <esi:include src="http://tcog.news.com.au/news/video/categories?t_product=video&site=$(site_name)&td_domain=$(site_name)&t_template=../video/index&td_path=$(pathvars{1})&td_list_style=block" dca="esi" onerror="continue"></esi:include>
		    </esi:when>
		    <esi:otherwise>
		        <esi:include src="http://tcog.news.com.au/search?t_product=video&domain=$(site_name)&t_template=../video/banner&type=video&maxRelated=20&pageSize=5&offset=0" onerror="continue"></esi:include>
		        <esi:include src="http://tcog.news.com.au/news/video/categories?t_product=video&site=$(site_name)&td_domain=$(site_name)&t_template=../video/index" dca="esi" onerror="continue"></esi:include>
		        <esi:include src="http://tcog.news.com.au/search?t_product=video&domain=$(site_name)&t_template=../video/moduleSpecial&td_title=Most%20Popular&origin=omniture&category=/video/$(HOSTNAME)/collection/popular-content/all/24hours&maxRelated=20&pageSize=20&offset=0" onerror="continue"></esi:include>
		    </esi:otherwise>
		</esi:choose>
		```

Group Deprecated Content URLs
=============================

The TCOG URLs below are deprecated versions of the above. They are functionally the same as their formal counterparts.

Group Search (Deprecated)
=========================

These behaviours are a 1 to 1 mapping to the Content API.

Search 1 [/search/{?t_product,td_template,td_module_header,td_timestamp,td_dateformat,td_standfirst,td_byline,td_date_header,td_kicker,td_thumbnail,td_imagewidth,td_imageheight,t_template}]
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TCOG call to Content API /content/v1 ...

-	Parameters

	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	t_template (optional, string, `compact`) ... Defaults to `extended` ... Template required to render output

		-	Values
			-	`compact`
			-	`compact-ol`
			-	`compact-ul`
			-	`extended`
			-	`imageblock`
			-	`popular-combined-footer`
			-	`popular-footer`
			-	`popular-headline`
			-	`popular-plain`

	-	td_module_header (optional, string, `t_module_header=Business+and+Finance`) ... text that defines the header for the placement (for instance, Business and Finance).

	-	td_timestamp = `true` (optional, boolean, `t_timestamp=false`) ... whether the timestamp is visible on each story block.

	-	td_dateformat = `H:mm A or dddd, D MMMM` (optional, string) ... A [moment.js format pattern](http://momentjs.com/docs/#/displaying/) for dates. Defaults to `H:mm A` for the `extended` template and `dddd, D MMMM` for `imageblock`.

	-	td_standfirst = `false` (optional, boolean) ... whether the standfirst is visible on each story block.

	-	td_byline = `false` (optional, boolean) ... the byline is visible on each story block. Note that the byline being visible is dependent on `t_standfirst=true`.

	-	td_kicker = `true` (optional, boolean) ... whether the kicker is visible on each story block.

	-	td_date_header = `false` (optional, boolean) ... whether to display a date header for items returned. Note that the date header is not duplicated so the content effectively appears grouped by date

	-	td_thumbnail = `true` (optional, boolean) ... whether the thumbnail is visible on each story block.

	-	td_imagewidth (optional, number) ... positive number describing the width (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

	-	td_imageheight (optional, number) ... positive number describing the height (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

### GET Notes [GET]

```no-highlight
http://tcog.news.com.au/search/?t_product=tcog
```

-	Response 200 (text/html)

	-	Body

		```
		<div class="module ">
		  <div class="module-content">
		    <div class="content-item cipos-0 cirpos-58">
		      <div id="93e41fc57339ce7656cc9274e7871065" class="story-block sbpos-0 sbrpos-58">
		        <h4 class="heading"><a>Steve 'Blocker' Roach on Tigers young guns, Benji return</a></h4>
		      </div>
		    </div>
		    <div class="content-item cipos-1 cirpos-57">
		      <div id="87516ba239ec241c35b6e9fa5680fe66" class="story-block sbpos-1 sbrpos-57">
		        <h4 class="heading"><a>House blaze</a></h4>
		      </div>
		    </div>
		    <!-- ... omitting most of the HTML -->
		    <div class="content-item cipos-56 cirpos-2">
		      <div id="2bc192a2da64f72bed3396057a42b98a" class="story-block sbpos-56 sbrpos-2">
		        <h4 class="heading"><a>'I never doped'</a></h4>
		      </div>
		    </div>
		    <div class="content-item cipos-57 cirpos-1">
		      <div id="2bc192a2da64f72bed3396057a42b98a" class="story-block sbpos-57 sbrpos-1">
		        <h4 class="heading"><a>'I never doped'</a></h4>
		      </div>
		    </div>
		  </div>
		</div>
		```

Search 2 [/common/search/:template/:format{?t_product,td_template,td_module_header,td_timestamp,td_dateformat,td_standfirst,td_byline,td_date_header,td_kicker,td_thumbnail,td_imagewidth,td_imageheight,t_template}]
---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TCOG call to Content API /content/v1 ...

-	Parameters

	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	t_template (optional, string, `compact`) ... Defaults to `extended` ... Template required to render output

		-	Values
			-	`compact`
			-	`compact-ol`
			-	`compact-ul`
			-	`extended`
			-	`imageblock`
			-	`popular-combined-footer`
			-	`popular-footer`
			-	`popular-headline`
			-	`popular-plain`

	-	td_module_header (optional, string, `t_module_header=Business+and+Finance`) ... text that defines the header for the placement (for instance, Business and Finance).

	-	td_timestamp = `true` (optional, boolean, `t_timestamp=false`) ... whether the timestamp is visible on each story block.

	-	td_dateformat = `H:mm A or dddd, D MMMM` (optional, string) ... A [moment.js format pattern](http://momentjs.com/docs/#/displaying/) for dates. Defaults to `H:mm A` for the `extended` template and `dddd, D MMMM` for `imageblock`.

	-	td_standfirst = `false` (optional, boolean) ... whether the standfirst is visible on each story block.

	-	td_byline = `false` (optional, boolean) ... the byline is visible on each story block. Note that the byline being visible is dependent on `t_standfirst=true`.

	-	td_kicker = `true` (optional, boolean) ... whether the kicker is visible on each story block.

	-	td_date_header = `false` (optional, boolean) ... whether to display a date header for items returned. Note that the date header is not duplicated so the content effectively appears grouped by date

	-	td_thumbnail = `true` (optional, boolean) ... whether the thumbnail is visible on each story block.

	-	td_imagewidth (optional, number) ... positive number describing the width (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

	-	td_imageheight (optional, number) ... positive number describing the height (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

### GET Notes [GET]

```no-highlight
http://tcog.news.com.au//common/search/abc/extended/?t_product=tcog
```

-	Response 200 (text/html)

	-	Body

		```
		<div class="module ">
		  <div class="module-content">
		    <div class="content-item cipos-0 cirpos-58">
		      <div id="93e41fc57339ce7656cc9274e7871065" class="story-block sbpos-0 sbrpos-58">
		        <h4 class="heading"><a>Steve 'Blocker' Roach on Tigers young guns, Benji return</a></h4>
		      </div>
		    </div>
		    <div class="content-item cipos-1 cirpos-57">
		      <div id="87516ba239ec241c35b6e9fa5680fe66" class="story-block sbpos-1 sbrpos-57">
		        <h4 class="heading"><a>House blaze</a></h4>
		      </div>
		    </div>
		    <!-- ... omitting most of the HTML -->
		    <div class="content-item cipos-56 cirpos-2">
		      <div id="2bc192a2da64f72bed3396057a42b98a" class="story-block sbpos-56 sbrpos-2">
		        <h4 class="heading"><a>'I never doped'</a></h4>
		      </div>
		    </div>
		    <div class="content-item cipos-57 cirpos-1">
		      <div id="2bc192a2da64f72bed3396057a42b98a" class="story-block sbpos-57 sbrpos-1">
		        <h4 class="heading"><a>'I never doped'</a></h4>
		      </div>
		    </div>
		  </div>
		</div>
		```

Retrieve Collection 2 [/collection/{id}/{?t_product,td_template,td_module_header,td_timestamp,td_dateformat,td_standfirst,td_byline,td_date_header,td_kicker,td_thumbnail,td_imagewidth,td_imageheight,t_template}]
-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

TCOG call to Content API /content/v1/collection/:id.

-	Parameters

	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	t_template (optional, string, `compact`) ... Defaults to `extended` ... Template required to render output

		-	Values
			-	`compact`
			-	`compact-ol`
			-	`compact-ul`
			-	`extended`
			-	`imageblock`
			-	`popular-combined-footer`
			-	`popular-footer`
			-	`popular-headline`
			-	`popular-plain`

	-	td_module_header (optional, string, `t_module_header=Business+and+Finance`) ... text that defines the header for the placement (for instance, Business and Finance).

	-	td_timestamp = `true` (optional, boolean, `t_timestamp=false`) ... whether the timestamp is visible on each story block.

	-	td_dateformat = `H:mm A or dddd, D MMMM` (optional, string) ... A [moment.js format pattern](http://momentjs.com/docs/#/displaying/) for dates. Defaults to `H:mm A` for the `extended` template and `dddd, D MMMM` for `imageblock`.

	-	td_standfirst = `false` (optional, boolean) ... whether the standfirst is visible on each story block.

	-	td_byline = `false` (optional, boolean) ... the byline is visible on each story block. Note that the byline being visible is dependent on `t_standfirst=true`.

	-	td_kicker = `true` (optional, boolean) ... whether the kicker is visible on each story block.

	-	td_date_header = `false` (optional, boolean) ... whether to display a date header for items returned. Note that the date header is not duplicated so the content effectively appears grouped by date

	-	td_thumbnail = `true` (optional, boolean) ... whether the thumbnail is visible on each story block.

	-	td_imagewidth (optional, number) ... positive number describing the width (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

	-	td_imageheight (optional, number) ... positive number describing the height (in pixels) that a story-block image will be displayed. *Only works for the imageblock template*.

### Get Notes [GET]

```http
http://tcog.news.com.au/collection/892fcb0f9febf97319ba00e400ae5e5e?t_product=tcog&pageSize=20&offset=0
```

-	Response 200 (text/html)

	-	Body

		```
		<div class="module module-content">
		    <div class=
		    "content-item cipos-0 cirpos-20 story-block sbpos-0 sbrpos-20" id=
		    "b76d439ac71170e1d207bd24295fea80">
		        <h4 class="heading"><span class="kicker">Politics</span><a href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/bob-hawke/story-fnnk86em-1226977948953?sv=5012dbb9e10f745cdf2a849c87023f03">Bob
		        Hawke</a></h4><a class="thumb-link" href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/bob-hawke/story-fnnk86em-1226977948953?sv=5012dbb9e10f745cdf2a849c87023f03"><img alt="Bob Hawke in 1991."
		        class="thumbnail" height="75" src=
		        "http://api.news.com.au/content/1.0/theaustralian/images/1226977949068?format=jpg"
		        width="100"></a>


		        <p class="standfirst"><span>Robert James Lee Hawke had a streak of
		        larrikinism that endeared him to many Australians</span></p>
		    </div>


		    <div class=
		    "content-item cipos-1 cirpos-19 story-block sbpos-1 sbrpos-19" id=
		    "167e9ed3bbf82302679356e51ea99b24">
		        <h4 class="heading"><span class="kicker">Media</span><a href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/rupert-murdoch/story-fnnk86em-1226978165444?sv=5e38819e55d2e391886832be59cd4235">Rupert
		        Murdoch</a></h4><a class="thumb-link" href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/rupert-murdoch/story-fnnk86em-1226978165444?sv=5e38819e55d2e391886832be59cd4235"><img alt="Rupert Murdoch photographed in the 1970’s."
		        class="thumbnail" height="75" src=
		        "http://api.news.com.au/content/1.0/theaustralian/images/1226978165873?format=jpg"
		        width="100"></a>


		        <p class="standfirst"><span>Tycoon From Down Under Takes On The
		        World.</span></p>
		    </div>


		    <!-- ... omitting for brevity -->


		    <div class=
		    "content-item cipos-18 cirpos-2 story-block sbpos-18 sbrpos-2" id=
		    "f4783a15b558d27d1fef81784a477b3a">
		        <h4 class="heading"><span class="kicker">The
		        Innovators</span><a href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/ian-frazer/story-fnnk86em-1226982045562?sv=3798a79eafb62d2a59f4fff1fc15cc42">Ian
		        Frazer</a></h4><a class="thumb-link" href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/ian-frazer/story-fnnk86em-1226982045562?sv=3798a79eafb62d2a59f4fff1fc15cc42"><img alt="Ian Frazer"
		        class="thumbnail" height="75" src=
		        "http://api.news.com.au/content/1.0/theaustralian/images/1226982045107?format=jpg"
		        width="100"></a>


		        <p class="standfirst"><span>God’s gift to women</span></p>
		    </div>


		    <div class=
		    "content-item cipos-19 cirpos-1 story-block sbpos-19 sbrpos-1" id=
		    "4d57e1bb4787f7fe019bd428965acbdd">
		        <h4 class="heading"><span class="kicker">Business</span><a href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/lang-hancock-gina-rinehart/story-fnnk86em-1226982002225?sv=c79a9f82b29d77514d4cb8f8c470e12c">Lang
		        Hancock &amp; Gina Rinehart</a></h4><a class="thumb-link" href=
		        "http://www.theaustralian.com.au/50th-birthday/top-50-most-influential/lang-hancock-gina-rinehart/story-fnnk86em-1226982002225?sv=c79a9f82b29d77514d4cb8f8c470e12c"><img alt="Hancock, left, with Gina and her first husband, Greg Hayward, who changed his surname fro"
		        class="thumbnail" height="75" src=
		        "http://api.news.com.au/content/1.0/theaustralian/images/1226982003974?format=jpg"
		        width="100"></a>


		        <p class="standfirst"><span>All real wealth is in the ground, and
		        societies become prosperous only by exploiting that
		        wealth</span></p>
		    </div>
		</div>
		```

Group Deprecated Config URLs
============================

Config 2 [/metadata/{?t_product,tc_key,tc_title,tc_meta,tc_link,tc_vars,tc_getvar}]
-----------------------------------------------------------------------------------

Deprecated version of [Config GET](./api.html#config-api-mapping-config-get)

-	Parameters
	-	t_product (required, string, `tcog`) ... Product identifiers reference tcog mappings to various API Keys and human contacts for product level notifications
	-	tc_key (required, string, `capability.newslocal`) ... The identifier for the top level of JSON held in the Config API
	-	tc_title = `false` (optional, boolean) ... Display the title
	-	tc_meta = `false` (optional, boolean) ... Display meta information
	-	tc_link = `false` (optional, boolean) ... Display links
	-	tc_vars = `false` (optional, boolean) ... Display Javascript variables
	-	tc_getvar = `false` (optional, boolean) ... Display unescaped raw output of a Javascript variable

### Get Notes [GET]

```http
http://tcog.news.com.au/metadata/?t_product=capability&tc_key=capability.newslocal&tc_vars=true&tc_meta=true&tc_link=true&tc_subkey=mosman-daily&tc_title=true
```

-	Response 200 (text/html)

	-	Body

		```
		<head>
		    <title>Mosman Daily | Local Community News NSW |
		    dailytelegraph.com.au</title>
		    <meta content=
		    "Read the latest news from the Mosman Daily and many more Sydney Local Newspapers online"
		    name="description">
		    <meta content=
		    "Mosman Daily, NewsLocal Newspapers, Local Community News, NSW News, NewsLocal, News, Mosman, Daily"
		    name="keywords">
		    <meta content="100002324295212">
		    <meta content="summary" name="twitter:card">
		    <meta content="@dailytelegraph" name="twitter:site">
		    <meta content="@dailytelegraph" name="twitter:site:id">
		    <link href="http://www.dailytelegraph.com.au/newslocal/mosman-daily/" rel=
		    "canonical">
		    <script type="text/javascript">
		        var overridePageSection = "LOCAL.MANLY-DAILY";var customFacebook = "/mosmandaily";var customTwitter = "MosmanDaily";var customTwitterId = "472162894797221888";var customEventRegion = "NSW North Shore";var overridePageTitle = "Mosman News";var localBodyClass = "mosman-daily";
		    </script>
		</head>
		```
