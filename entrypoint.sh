#!/usr/bin/env sh

function fix_linux_internal_host() {
  DOCKER_INTERNAL_HOST="host.docker.internal"

  if ! grep $DOCKER_INTERNAL_HOST /etc/hosts > /dev/null ; then
    DOCKER_INTERNAL_IP=`/sbin/ip route | awk '/default/ { print $3 }' | awk '!seen[$0]++'`
    echo -e "$DOCKER_INTERNAL_IP\t$DOCKER_INTERNAL_HOST" | tee -a /etc/hosts > /dev/null
    echo "Added $DOCKER_INTERNAL_HOST to hosts /etc/hosts"
  fi
}

fix_linux_internal_host

# Replace config env vars
printf "Replacing config env vars ..."
find .next/static -type f -exec sed -i -e "s|__SENTRY_DSN_HERE__|$SENTRY_DSN|g" -e "s/__ROTATION_PERIOD_HERE__/${ROTATION_PERIOD-300000}/g" {} \;
printf " done.\n"

# Run CMD
exec "$@"