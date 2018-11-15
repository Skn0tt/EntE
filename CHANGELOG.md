# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

* Use @sentry/browser in frontend
* Fixed: Inject Sentry Interceptor conditionally in backend
* Changed: Use @sentry/node instead of nest-raven

## [v0.8.3] - 2018-11-14

> Janked: Crash when Sentry is used

* Fixed Sentry import

## [v0.8.2] - 2018-11-14

> Janked: Crash when Sentry is used

* Added Sentry Error reporting to API

* Added more information to UI Sentry

## [v0.8.1] - 2018-11-14

> Janked: Crash when Sentry is used

* Changed: InstanceInfo now should be passed in Url-Encoding

## [v0.8.0] - 2018-11-13

### Added

* Show password requirements in relevant screens ([!170](https://gitlab.com/Skn0tt/EntE/merge_requests/170))
* Added License Check in CI ([Gitlab License Management](https://docs.gitlab.com/ee/user/project/merge_requests/license_management.html))
* Added Information about Instance to Login Screen. Can be configured via dockerapp-Config. ([!169](https://gitlab.com/Skn0tt/EntE/merge_requests/169))

### Changed

* Moved Email Functionality to API, removed RailMail from Project ([!168](https://gitlab.com/Skn0tt/EntE/merge_requests/168))
* Changed Username, displayname spec to allow common chars (-., umlauts)

## [v0.7.2] - 2018-11-12

### Added

* Added Check for Sentry DSN wether it is a valid DSN

### Changed

* Changed Docker Repository of ente.dockerapp: Now uses Gitlab Registry.

## [v0.7.1] - 2018-11-10

### Fixed

* Fixed some wrong language strings [#151](https://gitlab.com/Skn0tt/EntE/issues/151)
* Remove some unneeded dependencies to speed up build times
* Fixed language detection
* Fixed Warning from Immutable.JS: "property 'entries' shadows record API"
