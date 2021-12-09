# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Added OAuth 2.0 error middleware to `/authorize` endpoint.
- Added 4-arity form of token response parameter extension functions, taking
`msg`, `bind`, `grantType`, and `cb` as arguments.

### Changed
- `AccessTokenService#issue()` is called with `msg` argument containing `scope`
property, rather than `grant.scope`, when called from token response type.

### Removed
- Removed `type` property indicating grant type from first argument to token response
parameter extension functions.  Use 4-arity form instead.

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

[Unreleased]: https://github.com/authnomicon/oauth2/compare/v0.0.2...HEAD
[0.0.2]: https://github.com/authnomicon/oauth2/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/authnomicon/oauth2/releases/tag/v0.0.1
