# Metadata Transformer

## About

The metadata transformer is designed to deliver metadata (page title, meta tags,
social and open-graph data, and JS variable assignments) to pages which use tcog
transformers to render their content, and/or where the metadata for the page
cannot be properly determined by fatwire.

The metadata transformer renders a code fragment like the content transformer —
however its output is not designed to be human readable and should be placed in
the `<head>` of the page.

## How it Works

The metadata transformer requests a specially formatted JSON file from the News
Config API and uses that file to render the required HTML.

### Metadata JSON Format

First and foremost, the JSON file consumed by the metadata transformer must be
acceptable to the News Config API. The News Config API requires that the JSON
file is well formed, and at the top level, is an object.

Secondly, it also requires that a special key be present in the file, itself an
object, containing three parameters as demonstrated below:

```javascript
	{
		"news_sdk": {
			"appBundleId":  "tcog.core",
			"appVersion":   "0.1.0",
			"appPart":      "capability.newslocal"
		}
	}
```

These values are used to retrieve your JSON document from the Config API once it
has been ingested. The values of these are only required to be unique — however,
it is recommended for tcog that the following naming rules are used:

*	**appBundleId**: Leave this as `tcog.core`.
*	**appVersion**: Leave this as `0.1.0`.
*	**appPart**: Prefix this with your product/subproduct name, and then an
	identifier for the specific location where this metadata functionality will
	be deployed. For example, `the-australian.50th-anniversary` is a clear and
	unambiguous name.

#### tcog Specific Requirements

In the object at the root of the JSON document, tcog expects to find one or more
of the following keys:

*	**title**: (string) — This will render a title tag containing the content
	specified.
*	**link**: (array -> obj, [obj]...) — An array of link tags, serialised as
	JSON (HTML/XML attributes are mapped to JSON object properties.)
*	**meta**: (array -> obj, [obj]...) — An array of meta tags, serialised as
	JSON (HTML/XML attributes are mapped to JSON object properties.)
*	**vars**: (object -> { key: val... }) — An object map of JavaScript variable
	assignments. The value can be anything serialisable as JSON, but the key
	must be safe to use unquoted and unescaped (a bareword.)

### Example

```javascript
	{
		"news_sdk": {
			"appBundleId":  "tcog.core",
			"appVersion":   "0.1.0",
			"appPart":      "capability.newslocal"
		},
		"title": "News Local",
		"link": [
			{ "rel": "canonical", "href": "http://news.com.au/local" }
		],
		"meta": [
			{ "http-equiv": "content-type", "value": "text/html" },
			{ "name": "description", "content": "News.com.au Local Index" }
		],
		"vars": {
			"advertiserID": 1234,
			"dynamicFailover": { "contact": "john.citizen" }
		}
	}
```

#### Metadata Subkey

You can segregate the metadata for multiple pages by nesting it under a key in
the main object, known as a 'subkey'. This is then accessible by specifying a
parameter in the URL when querying the metadata transformer.

For example, if you've got two pages with very different JS variables that you'd
like to assign, you can divide them into separate objects like so:

```javascript
	{
		...
		"manlyDaily": {
			"vars": {
				"advertiserID": 1234,
				"dynamicFailover": { "contact": "john.citizen" }
			}
		},
		"northShoreTimes": {
			"vars": {
				"advertiserID": 54321,
				"dynamicFailover": { "contact": "jane.citizen" }
			}
		}
	}
```

In this example, the transformer would then render different JS variables
depending on whether the subkey specified with the request matched
`northShoreTimes` or `manlyDaily`.

Note that unless metadata is defined in the top-level object, if the subkey is
omitted, nothing will be rendered to the page.

### Requesting Data

At the time of writing, the metadata transformer was not yet exposed via the UI.
Therefore, the metadata transformer is only accessible via the URL endpoint:

	/metadata

In order to query it, you'll need to specify your product, as you do for the
content transformer:

	/metadata?product=<myproduct>

And you'll need to specify a key. This is the same as the `appPart` value that
you included in the JSON file.

	/metadata?key=capability.newslocal&product=<myproduct>

In order to specify the subkey, you can add that as an *additional* parameter:

	/metadata?key=capability.newslocal&subkey=manlyDaily&product=<myproduct>

If the subkey is derived from a url fragment or not in an appropriate format,
you can use tcog's Filter API to restructure it:

	// Imagine the filter input here is /news/manly-daily
	// split over multiple lines for readability

	// (Results in subkey=manlydaily)

	/metadata?
		key=capability.newslocal
		&subkey=$(REQUEST_PATH)
		&product=<myproduct>
		&filter:inurl=q.subkey|split('/')[1]|split('-')|join('')>subkey

Note: the Filter API is documented in another file.
