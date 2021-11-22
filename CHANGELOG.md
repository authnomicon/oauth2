# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Authorization code grant loads token response parameter extensions and extends
the response with parameters extensions yield.

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