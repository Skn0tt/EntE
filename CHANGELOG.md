# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v0.31.3] - 2020-02-26

- Update Sentry client to v5 ([#339](https://gitlab.com/Skn0tt/EntE/issues/339))
- Fix bug that prohibited administrators from changing their usernames ([#340](https://gitlab.com/Skn0tt/EntE/issues/340))

## [v0.31.2] - 2020-02-04

- Fix critical bug where login was broken when a teacher is deleted ([#338](https://gitlab.com/Skn0tt/EntE/issues/338))

## [v0.31.1] - 2020-01-29

- Fix: Magical login links must use the URL hash to contain the password ([#337](https://gitlab.com/Skn0tt/EntE/issues/337))

## [v0.31.0] - 2020-01-28

- Feature: "Magical" login links ([#336](https://gitlab.com/Skn0tt/EntE/issues/336))

## [v0.30.0] - 2020-01-19

The first release in the new decade!
This release moves Dark Mode out of Beta, improves translations, allows teachers and managers to unsubscribe from weekly e-mails and adds the option to promote teachers to be managers (and vice versa).

- Feature: Teachers can be promoted to managers (and vice versa) ([#248](https://gitlab.com/Skn0tt/EntE/issues/248))
- Translate date pickers correctly ([#330](https://gitlab.com/Skn0tt/EntE/issues/330))
- In teacher dropdown, sort by username ([#332](https://gitlab.com/Skn0tt/EntE/issues/332))
- Allow teachers/managers to unsubscribe from Weekly Summary ([#287](https://gitlab.com/Skn0tt/EntE/issues/287))
- Translate roles ([#323](https://gitlab.com/Skn0tt/EntE/issues/323))
- Move Dark Mode out of Beta ([#333](https://gitlab.com/Skn0tt/EntE/issues/333))
- Hide IDs from user (can still be retrieved from navigation bar) ([#331](https://gitlab.com/Skn0tt/EntE/issues/331))
- Fixed small typo ([#326](https://gitlab.com/Skn0tt/EntE/issues/326))
- Translate ReasonCategory filter to German ([#327](https://gitlab.com/Skn0tt/EntE/issues/327))

## [v0.29.2] - 2019-12-08

- Fixed sorting bug ([#324](https://gitlab.com/Skn0tt/EntE/issues/324))
- Fix signature state in report ([#325](https://gitlab.com/Skn0tt/EntE/issues/325))

## [v0.29.0] - 2019-11-26

- Translate WeeklySummary Email to german
- Change query for weeklysummary ([#286](https://gitlab.com/Skn0tt/EntE/issues/286)).
  Now, all slots are included that have either been created or fully signed during the last week.

## [v0.28.3] - 2019-11-26

- Optimize some bottlenecks while rendering ([#322](https://gitlab.com/Skn0tt/EntE/issues/322))

## [v0.28.2] - 2019-11-21

- Fix migration script for inbox (again)

## [v0.28.1] - 2019-11-21

- Fix migration script for inbox

## [v0.28.0] - 2019-11-17

- Add inbox filter ([#294](https://gitlab.com/Skn0tt/EntE/issues/294))
- Mention ente.app in WeeklySummary newsletter ([#321](https://gitlab.com/Skn0tt/EntE/issues/321))

## [v0.27.3] - 2019-11-17

- Don't forget table search and state when moving off the table ([#319](https://gitlab.com/Skn0tt/EntE/issues/319))

## [v0.27.2] - 2019-11-15

- Don't forget table filter state when moving off the table ([#312](https://gitlab.com/Skn0tt/EntE/issues/312))

## [v0.27.1] - 2019-11-13

- Remove serviceworker ([#315](https://gitlab.com/Skn0tt/EntE/issues/315))
- Sort slots naturally ([#311](https://gitlab.com/Skn0tt/EntE/issues/311))

## [v0.26.0] - 2019-10-31

- Fixed bug where entry notifications were sent when entry was already signed by parents ([#309](https://gitlab.com/Skn0tt/EntE/issues/309))
- Add manager notes feature ([#308](https://gitlab.com/Skn0tt/EntE/issues/308))
- Fixed crash when downloading empty tables ([#303](https://gitlab.com/Skn0tt/EntE/issues/303))
- Add API endpoint for invoking the invitation routine manually ([#299](https://gitlab.com/Skn0tt/EntE/issues/299))
- Fixed bug where the coursefilter didn't work

## [v0.25.0] - 2019-09-15

- Add button for changing passwords ([#293](https://gitlab.com/Skn0tt/EntE/issues/293))
- Queue E-Mail dispatches and retry them on failure ([#302](https://gitlab.com/Skn0tt/EntE/issues/302))
- Add UI button for invoking invitation routine ([#301](https://gitlab.com/Skn0tt/EntE/issues/301))
- Add API endpoint for invoking the invitation routine manually ([#300](https://gitlab.com/Skn0tt/EntE/issues/300))

## [v0.24.3] - 2019-09-08

- Validate SchiLD imports on the client side before importing ([#298](https://gitlab.com/Skn0tt/EntE/issues/298))
- Check username for containing "�" character ([#297](https://gitlab.com/Skn0tt/EntE/issues/297))
- Fixed a bug in the SchiLD parser that produced an error when trying to import users with more than one space in their username ([#299](https://gitlab.com/Skn0tt/EntE/issues/299))

## [v0.24.2] - 2019-09-06

Republished `v0.24.0` due to versioning error.

## [v0.24.0] - 2019-09-06 (not available)

- Fixed a bug where slots would appear doubled when signing an entry ([#292](https://gitlab.com/Skn0tt/EntE/issues/292))
- Fixed link to SchiLD-Tempalate in Docs ([#290](https://gitlab.com/Skn0tt/EntE/issues/290))
- Dispatch SignedInformation when parent signs an entry ([#289](https://gitlab.com/Skn0tt/EntE/issues/289))
- Fixed wrong language string showing on Slots page ([#288](https://gitlab.com/Skn0tt/EntE/issues/288))
- Fixed a bug where creating a manager wasnt allowed after having children selected ([#296](https://gitlab.com/Skn0tt/EntE/issues/296))
- Lowered minimal username length to 1 character ([#291](https://gitlab.com/Skn0tt/EntE/issues/291))

## [v0.23.1] - 2019-05-19

- Fixed a crash on updating ([#285](https://gitlab.com/Skn0tt/EntE/issues/285))

## [v0.23.0] - 2019-05-17

- Fixed a bug where parents could not sign an entry ([#284](https://gitlab.com/Skn0tt/EntE/issues/284))
- EntE now stores the date a signature was given ([#283](https://gitlab.com/Skn0tt/EntE/issues/283))
- Add mobile-friendly versions of the tables ([#205](https://gitlab.com/Skn0tt/EntE/issues/205))
- Fixed bug where re-login was not possible for teachers ([#282](https://gitlab.com/Skn0tt/EntE/issues/282))
- Add Course filter ([#67](https://gitlab.com/Skn0tt/EntE/issues/67))
- Add Report for whole grad year ([#232](https://gitlab.com/Skn0tt/EntE/issues/232))

## [v0.22.2] - 2019-04-30

- Update to Nest@v6
- Do not limit table height ([#281](https://gitlab.com/Skn0tt/EntE/issues/281))

## [v0.22.0] - 2019-04-28

- Implement more advanced healthcheck that actually checks dependencies ([#280](https://gitlab.com/Skn0tt/EntE/issues/280))
- Updated mui-datatables to v2.0.0, this fixes issues with dark mode theming ([#264](https://gitlab.com/Skn0tt/EntE/issues/264))
- Restrained data that the user receives: not everyone needs to know about sensitive data (email, birhtday etc.) ([#225](https://gitlab.com/Skn0tt/EntE/issues/225))

## [v0.21.0] - 2019-04-23

- Fixed deeply flawed adulthood detection ([#276](https://gitlab.com/Skn0tt/EntE/issues/276))
- Add new column "educational" to weekly summary
- Fix some typos ([#189](https://gitlab.com/Skn0tt/EntE/issues/189))
- Add further documentation on administration and usage ([#161](https://gitlab.com/Skn0tt/EntE/issues/161))
- Update to react-router@5.0.0 ([#216](https://gitlab.com/Skn0tt/EntE/issues/216))
- Made entry creation deadline configurable ([#260](https://gitlab.com/Skn0tt/EntE/issues/260))
- Fetching entries/slots/users removes potentially outdated data ([#265](https://gitlab.com/Skn0tt/EntE/issues/265))
- Fixed bug in user creation form where old data triggered validation ([#274](https://gitlab.com/Skn0tt/EntE/issues/274))
- Added script for consistently anonymising SQL dumps ([#273](https://gitlab.com/Skn0tt/EntE/issues/273))
- Fixed bug where data was provided to the wrong user when logging in on a different account ([#256](https://gitlab.com/Skn0tt/EntE/issues/256))
- Added: Version code is shown on login screen, too ([#271](https://gitlab.com/Skn0tt/EntE/issues/271))
- Changed styling so that FAB no longer hides pagination

## [v0.20.1] - 2019-03-18

- Fixed issue where corrupt entries could be created when using old clients ([#266](https://gitlab.com/Skn0tt/EntE/issues/266))

## [v0.20.0] - 2019-03-17

- Added dark mode ([#263](https://gitlab.com/Skn0tt/EntE/issues/263))
- Fixed sorting by dates ([#261](https://gitlab.com/Skn0tt/EntE/issues/261))
- Added possibility to filter items by recency in UI
- changed styling to make visual integration of tables better

## [v0.19.1] - 2019-03-13

- Fixed migration script SQL syntax

## [v0.19.0] - 2019-03-13

- Moved weekly update schedule into bull queues, now the API service can be scaled horizontally
- Added: Parents now receive a reminder email after a configurable number of days ([#251](https://gitlab.com/Skn0tt/EntE/issues/251))
- Fixed: Number entry fields now can be erased ([#259](https://gitlab.com/Skn0tt/EntE/issues/259))
- Added: New Entry reasons ([#252](https://gitlab.com/Skn0tt/EntE/issues/252))
- Improve user data validation to prevent further database inconsistencies ([#258](https://gitlab.com/Skn0tt/EntE/issues/258))
- Changed some datatypes in the database ([#257](https://gitlab.com/Skn0tt/EntE/issues/257))

## [v0.18.0] - 2019-02-27

- Fixed: critical bug that prohibited manager login when the database is corrupted ([#247](https://gitlab.com/Skn0tt/EntE/issues/247))
- Added: Excel export now contains a JSON field about the entry reason
- Changed: Close the import dialog after importing
- Changed: When an entry is signed/unsigned, EntE now sends students and parents a notification email
- Changed: When an entry is deleted, EntE now sends you a notification email
- Changed: Now Invitation links are tailored to the role of the receiving user ([#249](https://gitlab.com/Skn0tt/EntE/issues/249))
- Changed: Instanceconfig data is now stored in the SQL database, not in Redis. This enables it to be included in SQL backups ([#233](https://gitlab.com/Skn0tt/EntE/issues/233))

## [v0.17.3] - 2019-02-22

- Fixed: Fatal bug that prohibited login ([#247](https://gitlab.com/Skn0tt/EntE/issues/247))
- Changed: Only send invitation emails to users without password specified (on import)
- Fixed: Sunday is now 7th day of the week (see ISO 8601). This fixes a gnarly crash on the reports page

## [v0.17.2] - 2019-02-19

- Fixed: Wrong entry dates for databases in a different timezone (exclude "DATE" type from `mysql` parsing in order to circumvent https://github.com/mysqljs/mysql/issues/1374)
- Fixed: Only show "Show Report" button on students

## [v0.17.1] - 2019-02-18

- Changed: Invoke invitation routine for created users on import
- Fixed: Bug in 1st Migration where a wrong default value was given

## [v0.17.0] - 2019-02-11

- Fixed: Weird layout on reloading page (udpated dependency to latest version)
- Fixed: Sentry error reporting now gets passed the event_id
- Fixed: importing users can not remove admin users
- Fixed: crash when computing report with sunday entries
- Fixed crash where create-entry-validator stumbled upon missing property `reason`

## [v0.16.0] - 2019-01-29

- Added: Detailed reports on students and years, including diagrams to assess patterns in absences
- Changed: Users can now be renamed
- Added possibility to import SchiLD files
- Fixed bug where signature state of slots was not displayed correctly
- Changed: Reworked login flow to immediately return needed entities. This saves some round-trip at login.

## [v0.15.0] - 2019-01-24

- Changed: configuration of login banners and default language now can be done in the UI

## [v0.14.0] - 2019-01-15

- Changed: 14-day limit is now counted from end of entries ([#228](https://gitlab.com/Skn0tt/EntE/issues/228))
- Changed: ServiceWorker is now delivered with `Cache-Control: no-cache` to speed up update process

## [v0.13.3] - 2019-01-07

- Fixed: UI correctly receives DEFAULT_LANGUAGE parameter

## [v0.13.2] - 2019-01-06

- Fixed: "forSchool" is now really set properly

## [v0.13.1] - 2019-01-06

- Fixed: "forSchool" is now set properly

## [v0.13.0] - 2019-01-05

- Reworked Import Feature, it now can clean up old data
- scholar entries now need to have reason set ([#221](https://gitlab.com/Skn0tt/EntE/issues/221))
- Managers are now selectable as teachers so they no longer need an additional user account ([#162](https://gitlab.com/Skn0tt/EntE/issues/162))
- Changed type of "date" and "dateEnd" in database to `date` (from `datetime`)
- Added: UI now persists language setting to server so that emails can be sent accordingly
- Use birthday instead of "isAdult" field to determine wether user is adult
- Added Email Button to Entry ([#222](https://gitlab.com/Skn0tt/EntE/issues/222))
- Added Invitation Link ([#171](https://gitlab.com/Skn0tt/EntE/issues/171))
- Added ability to change language on the fly
- Fixed crash on old browsers ([#204](https://gitlab.com/Skn0tt/EntE/issues/204))
- Added Email Button to Entry ([#222](https://gitlab.com/Skn0tt/EntE/issues/222))
- Added Invitation Link ([#171](https://gitlab.com/Skn0tt/EntE/issues/171))
- Fixed crash on old browsers ([#204](https://gitlab.com/Skn0tt/EntE/issues/204))
- Added ability to change language on the fly
- Do not escape html table
- Introduced `@material-ui/styles`
- Added Redux persistance
- Fixed bug where Slot "signed" had wrong type
- Reworked Import screen
- Updated to `react-redux@6.0.0`

## [v0.12.1] - 2018-12-07

- Fixed: Weeklysummary now does not break because of type inaccuracies
- Fixed bug where AttachmentIcon was undefined

## [v0.12.0] - 2018-12-06

- Bundle size was decreased drastically to 2.5mb (500kb gzipped), now also javascript source code is cached.
- Changed: Timezone of MySQL Instance now needs to be set for the API, so that dates can be adjusted accordingly
  - Breaking: New Configuration Parameter `mysql.timezone`

## [v0.11.0] - 2018-12-05

- Changed: TypeOrm now logs more information
- Changed: When slot belongs to single-day entry, no date is saved
- Changed: DB Schema is not synced but only created when none is available
- Fixed: Close Settingsmenu on clicking item
- Changed: UI now responds with a 404 when requesting assets that do not exist

## [v0.10.0] - 2018-12-04

- Changed: More information on sentry errors
- Fixed: Error where all slots appeared as non-signed
- Added: About page showing version

## [v0.9.1] - 2018-12-02

- Fixed: Bug where entry could not be created

## [v0.9.0] - 2018-12-01

- Fixed: Now you can create entries (bug with monet)
- Add Precaching and Home-Screen add functionality
- API now supports pagination using `limit` and `offset` query params
- Changed: Password Reset now works using a modal
- Updated to React 16.7 (Hooks Alpha)
- Updated to Material-UI 3.6

## [v0.8.11] - 2018-11-30

- Fixed: password in user creation is now optional
- Fixed: translation of filter values in table
- Changed: API now takes entry date for slots as well, if it is a single-day entry
- Changed: Redux selectors now return maybe types in some cases
- Fixed: Import window now accepts all mime types and instead filters by file ending (must end on ".csv")
- Changed: Password Reset screen now redirects to login screen
- Changed: Login screen now shows feedback while pending requests

- Changed: Slots now shows wether the entry was for school or not, so teachers know about that

## [v0.8.10] - 2018-11-26

- Fixed: JWT decoding now works on non-ascii chars, so users like tom.schoß work as well
- Fixed: Removed malicious dependency on `event-stream` ([event-stream/#116](https://github.com/dominictarr/event-stream/issues/116))
- Changed: Backend now requests requesting user from database only when needed

## [v0.8.9] - 2018-11-26

- Fixed: Cron job env var is now named correctly (cron jobs now work)

## [v0.8.8] - 2018-11-24

- Fixed: Now users with umlauts in their username can log in
- Changed: Translation on Datepickers now is german as well
- Fixed: When user is of role `teacher`, no additional users are
- Fixed: Translation of Datatable

## [v0.8.7] - 2018-11-21

- Fixed: Bug where specific entries couldn't be openend
- Added: `smtp.address` contains email-address of smtp data
- Fixed: Email now supplies `From`-Header
- Fixed: Password requirements hint now shows "1 Number" instead of "1 upper-case"

## [v0.8.6] - 2018-11-20

- Fixed: Entry creation now works again

## [v0.8.5] - 2018-11-16

- Fixed: InstanceInfo URI Decoding

## [v0.8.4] - 2018-11-15

- Use @sentry/browser in frontend
- Fixed: Inject Sentry Interceptor conditionally in backend
- Changed: Use @sentry/node instead of nest-raven

## [v0.8.3] - 2018-11-14

> Yanked: Crash when Sentry is used

- Fixed Sentry import

## [v0.8.2] - 2018-11-14

> Yanked: Crash when Sentry is used

- Added Sentry Error reporting to API

- Added more information to UI Sentry

## [v0.8.1] - 2018-11-14

> Yanked: Crash when Sentry is used

- Changed: InstanceInfo now should be passed in Url-Encoding

## [v0.8.0] - 2018-11-13

### Added

- Show password requirements in relevant screens ([!170](https://gitlab.com/Skn0tt/EntE/merge_requests/170))
- Added License Check in CI ([Gitlab License Management](https://docs.gitlab.com/ee/user/project/merge_requests/license_management.html))
- Added Information about Instance to Login Screen. Can be configured via dockerapp-Config. ([!169](https://gitlab.com/Skn0tt/EntE/merge_requests/169))

### Changed

- Moved Email Functionality to API, removed RailMail from Project ([!168](https://gitlab.com/Skn0tt/EntE/merge_requests/168))
- Changed Username, displayname spec to allow common chars (-., umlauts)

## [v0.7.2] - 2018-11-12

### Added

- Added Check for Sentry DSN wether it is a valid DSN

### Changed

- Changed Docker Repository of ente.dockerapp: Now uses Gitlab Registry.

## [v0.7.1] - 2018-11-10

### Fixed

- Fixed some wrong language strings [#151](https://gitlab.com/Skn0tt/EntE/issues/151)
- Remove some unneeded dependencies to speed up build times
- Fixed language detection
- Fixed Warning from Immutable.JS: "property 'entries' shadows record API"
