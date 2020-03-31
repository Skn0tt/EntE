#!/usr/bin/env bash
cwd=$(pwd)
cd $(dirname "$(readlink -f "$0")")

echo "DROP DATABASE ente; CREATE DATABASE ente;" | ./compose.sh exec -T mariadb mysql -u ente -proot
./compose.sh exec -T mariadb mysql -u ente -proot ente <&0
./compose.sh restart api

cd $cwd