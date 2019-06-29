# Normalisers

API normalisers are a system that tcog provides to enable the arbitrary
transformation of API responses, prior to the final transformation operation.

This enables transformers to work around limitations in the the APIs they
consume, without unnecessarily complicating their controller logic.

## Structure of a normaliser

A normaliser is simply a regular node module which exports an object. On the
object are two functions, `guard`, and `normalise` — and one string property,
`name`, which is the human readable name of the normaliser.

### The Guard Function

If you're familiar with functional programming, you may know the term `guard`,
roughly speaking, as a component of the function definition that determines
whether the function is appropriate for the data being passed in. That model is
similar to the guard feature in normalisers, except that in JavaScript we don't
get that future as part of the language, and it needs to be a separate function.

If the guard function doesn't pass, the function won't be executed. If it does,
the function will be called.

The guard function should use the node-native `assert` module to establish a set
of requirements about the data the `normalise` function requires in order to
operate. (Alternately, an assertion-making module like `chai` is also fine.)

Every component of every object that the normaliser relies on should be tested
to ensure it meets with the operational requirements of the normaliser.

The guard function takes one parameter, which is the data returned from the API
or last normalisation operation. It is expected to throw errors when the data
is not suitable for normalisation, and execute synchronously. It should return
true.

#### Example

```javascript
module.exports.guard = function guard(apiResult) {

	assert(Array.isArray(apiResult.results),
				"Result list must be an array.");

	assert(apiResult.results.length > 0,
				"Must have a result to work with.");

	assert(apiResult.resultSize === apiResult.results.length,
				"The size must be inline with the result set returned.");

	apiResult.results.forEach(function(result) {
		assert("title" in result, "There must be a title in each result.");
	});

	return true;
};
```

### The Normaliser Function

In contrast to the guard function, the normaliser function is expected to run
asynchronously, and is structured similar to connect middleware — it is passed
the request, response, and `next` objects/functions relevant to a given HTTP
request — but it is also given the apiResult from the NAPI middleware, or
derived from the last normaliser which ran.

The function should not have to test the data coming in, since it is expected
those checks will be performed by the guard. The function should avoid throwing
exceptions.

### Example

This example modifies the title, and reverses the words in the standfirst.

```javascript
	module.exports.normalise = function normalise(apiResult, req, res, next) {

		var offset		= req.param("offset") || 0,
			pageSize	= req.param("pageSize") || Infinity;

		apiResult.results =
			apiResult.results.map(function(result) {

				// Replace the title for each result
				result.title =
					"REPLACEMENT TITLE FROM NORMALISER (" + result.title + ")";

				// Reverse the words in the standfirst
				result.standFirst =
					result.standFirst
						.split(/\s+/ig)
						.map(function(word) {
							return word.split("").reverse().join("");
						})
						.join(" ");

				// Return modified result to map
				return result;
			}, [])

		next(apiResult);
	};
```

## Installing/Registering a normaliser

Presently, normalisers are registered by transformers, and are detected
automatically when `tcog` boots. In order to have your normaliser detected by
`tcog`, you'll need to put it in a directory titled `normalisers` (both en-US
and en-AU/GB spellings are detected) inside your transformer directory:

```
transformers
├── - custom
├───── - configure			// (Your transformer)
├─────── - normalisers		// A folder of normalisers for your transformer
├───────── + normaliser1.js	// Each transformer file
└───────── + normaliser2.js	// ...
```
