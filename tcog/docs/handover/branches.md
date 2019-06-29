# Branches

The majority of old unused branches reside under the `/archive/` path. These are branches which may still be of use. Notable branches worth mentioning are detailed below.

#### bugfix/fix-cache-expiration

This branch contains a fix localized to the agent (`lib/agent`). It addresses an issue whereby if for some reason the cache ttl of an item in redis is -1, meaning "do not expire" it can still be correctly validated to determine if the content is stale and should be updated.

This is done by revising the `self.cachedRequest.isStale` to use the closeToExpiry method found within `./lib/cache`. This keep cache expiration checks consistent.

##### expirinator

Included in this branch is a tool to interact with redis to find all keys with a "-1" ttl set. The tool can then be used to delete these items from redis.

Found in `./tools/cache/expirinator`.

#### feature/agent-refactor

This branch is an attempt at refactoring the agent. If I can recall correctly it was at the stage whereby I was going to start writing tests to validate the new interface.

#### feature/trending-transformer

This branch was created by Chris. It's functional though not fully integrated with tests etc. The trending transformer interacts with our elastic cache and can be used to predict trends based upon gradient interpolation.

This branch has been demoed to Adam before so worth keeping around, kicking the tyre's and figuring out how best to revisit.

#### feature/template-fuzzing

An attempt to improve template testing by fuzzing the input document a template receives when testing. It may be of use.

It makes use of [hotfuzz](https://www.npmjs.com/package/hotfuzz)

#### feature/_next/popular-redirect

This change redirects all requests to the v2 CAPI equivalent should the initial request
contain a category, domain and origin parameter. These are the bare minimum params
required to perform a redirection.

The change was requested by product as they do not have the resources to make this
change as there are over 400 places where there old legacy references.

As part of this change most popular calls have been changed from search to retrieves
as part of a performance improvement provided by the API team.

Best to chat with Charlie if this is still needed.
