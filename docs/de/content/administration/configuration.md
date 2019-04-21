---
title: Konfiguration
---

# Konfiguration

_EntE_ wird durch eine docker-app Konfigurationsdatei im YAML-Format konfiguriert.

## Beispiel-Konfiguration

```yml
config:
  baseUrl: https://ente.simonknott.de
  port: 80
  rotation_period:
    keys: 900
    ui: 300

sentry: # sentry DSN, optional
  api: deine_api_sentry_dsn
  ui: deine_ui_sentry_dsn

mysql: # mysql config
  host:
  port:
  username:
  password:
  database:
  timezone: "+01:00" # zeitone der Datenbank, als ISO 8601 angegeben

smtp: # smtp config
  host:
  port:
  username:
  password:
  address: ente@simonknott.de # verwendete Absender-Addresse
  sender: Beispiel-EntE # angezeigter Absender
```
