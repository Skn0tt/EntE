# dump-anonymiser

This CLI tool takes an SQL-Dump of EntE's database and anonymises the following fields:

- username
- displayname
- email-address

It sets the password to NULL for all accounts, so they can be reset using the password reset feature.

The process assigns consistent data by user-id, so anonymising the same user will yield the same data provided its id stays the same.

## Usage

```sh
./dump-anonymiser.sh <input_dump.sql> <output_dump.sql>
```

You can configure the following ENV variables:

| Variable       | Default     |
| -------------- | ----------- |
| MYSQL_USERNAME | `root`      |
| MYSQL_PASSWORD | `root`      |
| MYSQL_bin      | `mysql`     |
| MYSQL_bin      | `mysqldump` |

If your data happens to live inside a docker container, you could adjust it like this:

```sh
MYSQL_BIN='docker exec -i t_mariadb_1 mysql'
MYSQLDUMP_BIN='docker exec -i t_mariadb_1 mysqldump'
```
