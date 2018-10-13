_EntE_ is configured through a docker-app config file.

# Example Config File

```yml
config:
  port: 80
  rotation_period:
    keys: 900
    ui: 300

sentry: # sentry DSNs, optional
  api: my_random_key:api
  ui: my_random_key:ui

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
