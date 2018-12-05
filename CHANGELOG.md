# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

* Changed: TypeOrm now logs more information
* Changed: When slot belongs to single-day entry, no date is saved

* Changed: DB Schema is not synced but only created when none is available
* Fixed: Close Settingsmenu on clicking item
* Changed: UI now responds with a 404 when requesting assets that do not exist

## [v0.10.0] - 2018-12-04

* Changed: More information on sentry errors
* Fixed: Error where all slots appeared as non-signed
* Added: About page showing version

## [v0.9.1] - 2018-12-02

* Fixed: Bug where entry could not be created

## [v0.9.0] - 2018-12-01

* Fixed: Now you can create entries (bug with monet)
* Add Precaching and Home-Screen add functionality
* API now supports pagination using `limit` and `offset` query params
* Changed: Password Reset now works using a modal
* Updated to React 16.7 (Hooks Alpha)
* Updated to Material-UI 3.6

## [v0.8.11] - 2018-11-30

* Fixed: password in user creation is now optional
* Fixed: translation of filter values in table
* Changed: API now takes entry date for slots as well, if it is a single-day entry
* Changed: Redux selectors now return maybe types in some cases
* Fixed: Import window now accepts all mime types and instead filters by file ending (must end on ".csv")
* Changed: Password Reset screen now redirects to login screen
* Changed: Login screen now shows feedback while pending requests

## [v0.8.10] - 2018-11-26

* Fixed: JWT decoding now works on non-ascii chars, so users like tom.schoß work as well
* Fixed: Removed malicious dependency on `event-stream` ([event-stream/#116](https://github.com/dominictarr/event-stream/issues/116))
* Changed: Backend now requests requesting user from database only when needed

## [v0.8.9] - 2018-11-26

* Fixed: Cron job env var is now named correctly (cron jobs now work)

## [v0.8.8] - 2018-11-24

* Fixed: Now users with umlauts in their username can log in
* Changed: Translation on Datepickers now is german as well
* Fixed: When user is of role `teacher`, no additional users are
* Fixed: Translation of Datatable

## [v0.8.7] - 2018-11-21

* Fixed: Bug where specific entries couldn't be openend
* Added: `smtp.address` contains email-address of smtp data
* Fixed: Email now supplies `From`-Header
* Fixed: Password requirements hint now shows "1 Number" instead of "1 upper-case"

## [v0.8.6] - 2018-11-20

* Fixed: Entry creation now works again

## [v0.8.5] - 2018-11-16

* Fixed: InstanceInfo URI Decoding

## [v0.8.4] - 2018-11-15

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
