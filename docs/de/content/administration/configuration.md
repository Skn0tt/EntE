---
title: Konfiguration
---

# Konfiguration

_EntE_ wird durch seine Umgebungsvariablen konfiguriert.

## Beispiel-Konfiguration

```yml
NODE_ENV=production
BASE_URL=localhost:3000
CRON_WEEKLY_SUMMARY="0 16 * * 5"

JWT_ROTATION_INTERVAL=900000
JWT_EXPIRY=900000

REDIS_HOST=host.docker.internal # required to use localhost
REDIS_PORT=6379
REDIS_PREFIX=ente

MYSQL_HOST=host.docker.internal # required to use localhost
MYSQL_PORT=3306
MYSQL_USERNAME=root
MYSQL_PASSWORD=root
MYSQL_DATABASE=ente
MYSQL_TIMEZONE=Z

SMTP_HOST=host.docker.internal # required to use localhost
SMTP_PORT=1025
SMTP_USERNAME=admin
SMTP_PASSWORD=root
SMTP_POOL=
SMTP_ADDRESS=ente@ente.app
SMTP_RETRY_DELAY=3600000

SENTRY_DSN=
ROTATION_PERIOD=
```
