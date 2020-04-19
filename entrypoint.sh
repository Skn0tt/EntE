#!/usr/bin/env sh

# Replace config env vars
printf "Replacing config env vars ..."
find .next/static -type f -exec sed -i -e "s/__SENTRY_DSN_HERE__/$SENTRY_DSN/g" -e "s/1415626180484145813288575/${ROTATION_PERIOD-300}/g" {} \;
printf " done.\n"

# Run CMD
exec "$@"