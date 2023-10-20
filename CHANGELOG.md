# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.5] - 2023-10-20

TODO: Review this for accuracy.

### Added
- Support for web origin-bound responses, if the client has a registered web
origin and specifies that origin as the value of `redirect_uri` in the
authorization request.
- Support for redirect URI schemes, enabling support for [IDP-IFrame-based Implict Flow](http://lists.openid.net/pipermail/openid-specs-ab/Week-of-Mon-20151116/005865.html)
and the storagerelay scheme.
- Support for `module:@authnomicon/oauth2.tokenResponseParametersFn;grant_type=code`
implementation to yield a set of tokens for binding.

### Changed
- `code` request processor passes `ares` directly through to
`AuthorizationCodeService#issue`.
- `token` request processor passes `ares` directly through to
`AccessTokenService#issue`.
- `authorization_code` token request processor passes `msg` directly through
from `AuthorizationCodeService#verify` to `AccessTokenService#issue`.
- Renamed `http://i.authnomicon.org/oauth2/AuthorizationCodeService` interface
to `module:@authnomicon/oauth2.AuthorizationCodeService`.
- Renamed `http://i.authnomicon.org/oauth2/AccessTokenService` interface to
`module:@authnomicon/oauth2.AccessTokenService`.
- Renamed `http://i.authnomicon.org/oauth2/authorization/http/ResponseType`
interface to `module:oauth2orize.RequestProcessor`.
- Renamed `http://i.authnomicon.org/oauth2/authorization/http/RequestParameters`
interface to `module:oauth2orize.RequestParametersProcessor`.
- Renamed `http://i.authnomicon.org/oauth2/authorization/http/ResponseMode`
interface to `module:oauth2orize.Responder`.
- Renamed `http://i.authnomicon.org/oauth2/authorization/http/ResponseParameters`
interface to `module:oauth2orize.responseParametersFn`.
- Renamed `http://i.authnomicon.org/oauth2/token/http/GrantType` interface to
`module:oauth2orize.tokenRequestHandler`.
- Renamed `http://i.authnomicon.org/oauth2/token/http/ResponseParameters`
interface to `module:@authnomicon/oauth2.tokenResponseParametersFn;grant_type=code`.

### Removed
- Removed 4-arity form of tokenResponseParametersFn which passed `grantType` as
third argument.

## [0.0.4] - 2021-12-13
### Added
- Added OAuth 2.0 error middleware to `/authorize` endpoint.
- Added `issuer` property to `msg` argument passed to `AccessTokenService#issue()`,
when called from token response type.
- Added `authContext` property to `msg` argument passed to `AccessTokenService#issue()`,
when called from token response type.
- Added 4-arity form of token response parameter extension functions, taking
`msg`, `bind`, `grantType`, and `cb` as arguments.

### Changed
- Respond with `interaction_required` error if prompt is neccessary, but client
requested `prompt=none`.
- `AccessTokenService#issue()` is called with `msg` argument containing `scope`
property, rather than `grant.scope`, when called from token response type.
- Rename `http://i.authnomicon.org/oauth2/token/http/AuthorizationGrantExchange`
interface to `http://i.authnomicon.org/oauth2/token/http/GrantType`.

### Removed
- Removed `type` property indicating grant type from first argument to token response
parameter extension functions.  Use 4-arity form instead.

### Fixed
- Popping state pushed prior to sending authorization response.  Fixes issue in
which incorrect `state` value was sent to client's redirect endpoint when
response was sent immediately.

## [0.0.3] - 2021-12-02
### Added
- Authorization code grant type loads token response parameter extensions and
extends the response with parameters yielded by extensions.
- Authorization code response type loads authorization response parameter
extensions and extends the response with parameters yielded by extensions.
- Added `prompt` property to `request` passed to `AuthorizationService`.
- Added `selectedSession` property to `response` passed to `AuthorizationService`.
- Added `issuer` to `req.oauth2.res` prior to responding to authorization
request.
- Added `authContext` to `req.oauth2.res` prior to responding to authorization
request.
- Added `scope` property to `msg` argument passed to `AccessTokenService#issue()`.
- Added `issuer` property to `msg` argument passed to `AccessTokenService#issue()`.
- Added `authContext` property to `msg` argument passed to `AccessTokenService#issue()`.
- Added `issuer` property to `msg` argument passed to `AuthorizationCodeService#issue()`.
- Added `authContext` property to `msg` argument passed to `AuthorizationCodeService#issue()`.
- Added `request` property to transaction state stored in session, containing
all parameters in the authorization request.

### Changed
- `AuthorizationCodeService#issue()` is called with `msg` argument containing
`scope` property, rather than `grant.scope`.
- Simplifed authorization code exchange validation of redirect URI based on
`claims.redirectURI`, rather than more complicated `claims.confirmation`.
- `/authorize` and `/authorize/continue` endpoints parse cookies, to facilitate
implementation of [OpenID Connect Session Management](https://openid.net/specs/openid-connect-session-1_0.html).
- Updated to call `Router#dispatch`, as provided by latest `@authnomicon/prompts`.

### Removed
- Removed `responseType`, `scope`, and `state` properties from transaction state
stored in session.  Use parameters stored under `request`.

## [0.0.2] - 2021-11-17
### Added
- Initial implementation of Dynamic Client Registration Protocol.

### Changed
- Updated to use `flowstate@0.5.x` API.

### Fixed
- No longer using undefined `redirectURI` variable in implicit grant.

## [0.0.1] - 2021-10-19

- Initial release.

[Unreleased]: https://github.com/authnomicon/oauth2/compare/v0.0.4...HEAD
[0.0.4]: https://github.com/authnomicon/oauth2/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/authnomicon/oauth2/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/authnomicon/oauth2/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/authnomicon/oauth2/releases/tag/v0.0.1
