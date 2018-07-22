_EntE_ is configured via environment variables.

| Variable            | Meaning                                         | Example            | Required |
| ------------------- | ----------------------------------------------- | ------------------ | -------- |
| `HOST`              | Hostname to serve on                            | ente.simonknott.de | true     |
| `LETSENCRYPT_EMAIL` | email address used to obtain HTTPS certificates | ente@simonknott.de | true     |
| `SMTP_HOST`         | email server host                               | smtp.simonknott.de | true     |
| `SMTP_PORT`         | email server port                               | 587                | true     |
| `SMTP_USERNAME`     | email server login username                     | ente@simonknott.de | true     |
| `SMTP_PASSWORD`     | email server login password                     | myPassword         | true     |
| `SMTP_SENDER`       | email server send address                       | ente@simonknott.de | true     |
| `SENTRY_API_DSN`    | Sentry token for error logging on backend       | KLSJANM            | false    |
| `SENTRY_UI_DSN`     | Sentry token for error logging on UI            | KLSJANM            | false    |
