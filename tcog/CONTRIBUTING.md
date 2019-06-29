# Contributing to tcog

## Overview

`tcog` is built upon a foundation of [express](http://expressjs.com/) with a custom routing system that uses the concept of `transformers` that facilitate the transformation of downstream APIs into usable rendered fragments/placements.

### Writing tcog transformers

See the [transformer](./transformers/README.md) guide for more information on how to build transformers. It also details what kind of functionality is appropriate to be served by a transformer, and examples of good and bad uses of the `tcog` model.

## Key Branches & Tags

`master` branch reflects the current state of what is deployed to production & must be fully operational and pass the test suite before it can be deployed to an environment.

Feature branches are forked from `master`. They are merged back into `master` upon successful completion of a code review.

## Coding standards

Good, clear and consistent code styles are pivotal in the success of any software project. Good use of style can reduce errors, consistency will enable us to work together efficiently.

### JavaScript

* JSHint ( see JSHint section below ).
* Protect the global scope
* Indent with 4 spaces ( see Editor config )
* Document as you go using ng-docs. Comments should be used to provide clarity.
* Write tests, unit tests are written in Mocha using spec style
* Code should be hard-wrapped at 80 characters.
* Variables and method names should follow the general JS formatting standard: `TitleCase` for constructors, `UPPER_CASE` for constants, and `camelCase` for everything else.
* Use the top variable declaration to define all variables with global scope using a comma operator. Exceptions are permitted for complex initialisations.

When in doubt, code standards are formalised in the tasks run by `grunt validate` — most common errors or deviations should be identified.

### Terms and Spelling

* `tcog` is always written lowercase, without hyphens.
* `tcog` uses US English. Please ensure variable and method names, and other code tokens are in line with this standard.

## Submitting Pull Requests

Please take steps to make merging easy and keep the history clean and useful. `tcog` uses the feature-branch workflow. You should always work on a branch.

### Commit Messages

Commit messages must be formatted in a specific way, to facilitate better auditing and review.

The structure is as follows:

* A short (~10 character) broad area of work that identifies the change
* A longer (~50-60 character) description of the change
* A double line break (`\n\n`)
* A paragraph or number of paragraphs describing in explicit detail the specifics of the change. If it fixes any issues, reference their issue IDs directly.
* A double line break (`\n\n`)
* A semver tag of the format /#(major|minor|patch) which details the estimated impact of the change made to `tcog`. ( See versioning )

The message must be hard-wrapped at 80 characters.

#### Example

```
Core Transformers : Corrected broken stylesheet in view

Added the closing characters to the tag after encountering broken markup as
described in issue #228.

/#patch
```

## Versioning

`tcog` is maintained according to the [Semantic Versioning](http://semver.org/) guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>+<build>`

Constructed with the following guidelines:

- **major** release indicates a large change where backwards compatibility is broken such as large application change where public interfaces have significantly changed.

- **minor** release indicates a normal change that maintains backwards compatibility and is relatively small. This could also be the introduction of a new feature.

- **patch** release indicates a bugfix or small change which does not affect compatibility. This could be documentation updates.

While multiple commits may be bundled into a single pull request, the semver tag of that pull request is considered to be equivalent to the most severe tag of any individual commit. For example, a pull request might incorporate three patch commits and one major commit. In this case, the pull request will be considered major.

Major & Minor impact commits **must** be approved by a project maintainer
prior to merging. Normal commits may also require approval in future.

### Check it passes the tests

Run `make check` to check that your work passes JSHint and the server-side mocha unit tests. If this fails, your PR will not be accepted.

## Before Your Pull Request Is Accepted:
**(Or, how I learnt to stop worrying and love the bomb)**

Here are a list of things you must satisfy before your pull request can be
merged — or which must be checked should you be responsible for approving a PR
for merger.

*	Every major function should have an ngdoc block associated with it. For a
	function to be 'major', it may satisfy any of the following conditions:
	*	Ten lines or more of code, including the function definition
	*	Publicly exposed (as in, it available via module.exports, or a
		sub-property thereof, regardless of how deeply nested.)
*	Every publicly exposed functions must have unit tests. These unit tests
	should aim for 100% coverage of every function and condition.
*	All code must be made available to, and pass JSHINT. Exceptions may be
	tolerated under certain conditions, but this must be discussed and
	documented.
*	Commit messages must all follow the preordained format, and must include
	an impact assessment.
*	Should the PR contain any commits classified as semver major, the code
   *must* be checked out, run, and have had the test suite run by 
   the reviewer/s.
*	Should the PR contain any commits classified as semver major or where a new
   feature is introduced the code should be reviewed by at least two reviewers.
