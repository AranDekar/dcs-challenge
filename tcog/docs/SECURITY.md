# Security

## 1. Risks

While `tcog` itself is written with the highest possible attention to security
and stability, it would be naive to assume it flawless, under any circumstances.

Therefore, it is important and advisable to identify risks associated with the
application and its development procedures which may threaten the security or
stability of the system, so that treatments and mitigation strategies may be
developed — even if the risks themselves may seem unlikely.

### 1.1 External Dependencies

Currently, `tcog` relies on external dependencies to perform key application
functions. These dependencies are downloaded, unpackaged, and executed at build
and deployment time as part of the deployment process, from sources such as the
Debian & Ubuntu apt repositories, Node Package Manager (NPM), and Github.

There is a risk, which has occurred in the wild previously, that the
repositories of widely used application dependencies could be targeted by
malicious agents with the intention of injecting malicious code into the
dependencies themselves. Even if such an intrusion were quickly reversed by the
repository maintainer, there would be no guarantee that had a `tcog` build
occurred after an attack and before a reversion, that malicious code in a `tcog`
dependency could be used to attack `tcog`, vandalise it, control its internal
functions, or attack other News Ltd. infrastructure.

The risk of this happening is low, but not impossible. It is important to
understand that all external dependencies are essentially untrusted code — and
yet running with an implicit level of trust — the same level of trust with which
application code runs.

#### 1.1.1 Mitigation Strategies

Several possible mitigation strategies have been identified:

*	**Maintain independent mirrors of every external dependency** (recommended)
	This would improve security by adding an extra layer between the external
	codebase and News Ltd. application and infrastructure, facilitating auditing
	and security management of external code. In the event that the upstream
	repository for an application dependency were exploited, it would be less
	likely to affect a locally hosted mirror, and would give the dependency
	maintainer time to remedy the problem before News Ltd. pulls down newer
	versions of the dependency.

*	**Do not pull down external dependencies in production builds/deployments**
	Instead, package them up after testing and deliver them to the production
	infrastructure packaged with the application. While this is not foolproof,
	it provides an opportunity for developers familiar with the application and
	the expected behaviour of dependencies to observe any unusual behaviour or
	activity that might be caused by a damaged or exploited dependency. It
	prevents untrusted code from being downloaded to production servers, and
	affords the dependencies themselves a level of trust. It also gives
	developers a short window of time to do a rudimentary security audit.

### 1.2 API Attack Passthrough

It is possible that `tcog` might be used to attack a News Ltd API, by crafting a
malicious request payload directed at a `tcog` transformer.

#### 1.2.1 Mitigation Strategies

*	`tcog` transformers should be written so that they *only* pass through
	parameters required to meet their design specification, and filter those
	parameters according to the API specification itself.

*	`tcog` itself should provide abstractions that strictly enforce compliance
	with API specifications.

*	Requests for internal APIs and their result should be cached against the
	parameters that are passed, rather than the parameters given by the client.
	This provides a small additional level of security, where even if a
	malicious response is compliant with the API specification, a result may
	already be cached, preventing it from hitting the upstream API.

### 1.3 Cache Poisoning

Following from 1.2, it is possible that a malicious API request returning, for
example, inline JavaScript exploit code, could be held by the `tcog` and/or
upstream caches and returned to other users even as responses to legitimate API
queries/requests.

#### 1.3.1 Mitigation Strategies

Several possible mitigation strategies have been identified:

*	Use a short cache lifetime (~15 minutes) to balance performance concerns
	against limiting the window of exposure to website and application
	users/visitors of possible exploit code or malicious intrusion

*	Provide easily accessible and automate-able methods for clearing caches, on
	the application tier, and on upstream tiers. Should a cache be poisoned with
	a malicious response, it is important that it be able to be cleared quickly,
	and the offending resources destroyed.

*	Provide a level of audit-ability in the caching layer so that a cached
	response can be examined to retrieve the request that generated it.

### 1.4 XSS

Given the plans to introduce `tcog` as a backend for keystone News Ltd online
properties, it represents an attractive potential target for an attacker looking
to introduce malicious code to the front end of News Ltd websites and
applications.

It is possible that either through inappropriate filtering in a `tcog`
transformer or an upstream API, that a Cross Site Scripting exploit could occur.

#### 1.4.1 Mitigation Strategies

*	Where possible, recommend the introduction of *Content Security Policy*
	headers on sites and applications that consume content delivered by `tcog`

*	Ensure API definitions flag where unescaped HTML content should be returned,
	enabling `tcog` to automatically escape HTML content not being returned in
	appropriately flagged fields.

*	Template code should be written to explicitly escape all inputs unless
	unescaped input is absolutely required.

*	`tcog` and its remote APIs should avoid directly including parameters from
	requests in rendered responses.

## Auditing and Management Procedures

**THIS SECTION TO BE DETERMINED**
