dev:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
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
