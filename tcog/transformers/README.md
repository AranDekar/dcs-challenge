# transformers

Think of a transformer as a route controller. A transformer may be a simple proxy pass through to an API or a more opinionated call to an API ( see transformers/components ).

In order for a transformer to be used by `tcog` it must return a map of routes. Each route should have an array of middleware associated with the final one either ending in a res.end() or a render via the template handler middleware (`./lib/middleware/template-handler`).

```
'use strict';
module.exports = function () {

	var self = {
			middleware : {
				a : [ ... ... ],
				b : [ ... ... ]
			}
		};

	return {
		'/some/route/a' : self.middleware.a,
		'/some/route/b' : self.middleware.b
	};

};
```
> An example of `tcog` transformer

At this stage transformers are not automatically registered, they must be explicitly registered by referencing them in `transformers/index`.

A transformer can also export an array of transformers, these are registered exactly the same as a single transformer. This approach is useful when you have a collection of common transformers.

```
'use strict';
module.exports = [
    { '/legacy/route/a' : [ func .. ] }
    { '/latest/route/b' : [ func .. ] }
];
```

> Example of a transformers array.
