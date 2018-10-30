_EntE_ is configured through a docker-app config file.

# Example Config File

```yml
config:
  host: ente.simonknott.de
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
