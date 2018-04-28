_EntE_ can is configured via environment variables.

| Variable            | Meaning                                         | Example            | Required |
| ------------------- | ----------------------------------------------- | ------------------ | -------- |
| `HOST`              | Hostname to serve on                            | ente.simonknott.de | true     |
| `LETSENCRYPT_EMAIL` | email address used to obtain HTTPS certificates | ente@simonknott.de | true     |
| `SMTP_HOST`         | email server host                               | smtp.simonknott.de | true     |
| `SMTP_PORT`         | email server port                               | 587                | true     |
| `SMTP_USER`         | email server login username                     | ente@simonknott.de | true     |
| `SMTP_PASSWORD`     | email server login password                     | myPassword         | true     |
| `SENTRY_API_DSN`    | Sentry token for error logging on backend       | KLSJANM            | false    |
| `SENTRY_UI_DSN`     | Sentry token for error logging on UI            | KLSJANM            | false    |
