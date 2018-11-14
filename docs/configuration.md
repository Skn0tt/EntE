_EntE_ is configured through a docker-app config file.

# Example Config File

```yml
config:
  baseUrl: https://ente.simonknott.de
  language: en # "en" | "de"
  instanceInfo: # Is shown on login screen, encoded with URI-Encoding
    en: "Welcome to the EntE instance."
    de: "Willkommen auf der EntE-Instanz."
  port: 80
  rotation_period:
    keys: 900
    ui: 300

sentry: # sentry DSNs, optional
  api: my_sentry_dsn_api
  ui: my_sentry_dsn_ui

mysql: # mysql config
  host:
  port:
  username:
  password:
  database:

smtp: # smtp config
  host:
  port:
  username:
  password:
  sender:
```
