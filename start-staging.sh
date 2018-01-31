docker-compose \
  -f docker-compose.yml \
  -f docker-compose.prod.yml \
  -f docker-compose.staging.yml \
  up \
  -d