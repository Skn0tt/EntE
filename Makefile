dev: build-docker
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		up -d

staging: build-docker
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
  	-f docker-compose.staging.yml \
		up -d

prod: build-docker
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.prod.yml \
		up -d

build-docker: ente-api ente-ui nginx-proxy ente-rotator

ente-api:
	$(MAKE) -C packages/api build

ente-ui:
	$(MAKE) -C packages/ui build

ente-rotator:
	$(MAKE) -C packages/rotator build

nginx-proxy:
	$(MAKE) -C packages/nginx-proxy build
