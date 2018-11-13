# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

* Moved Email Functionality to API, removed RailMail from Project
* Changed Username, displayname spec to allow common chars (-., umlauts)
* Added License Check in CI ([Gitlab License Management](https://docs.gitlab.com/ee/user/project/merge_requests/license_management.html))

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
