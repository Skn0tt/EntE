dev:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		up -d

build-docker: ente-api ente-ui nginx-proxy

ente-api:
	$(MAKE) -C packages/api build

ente-ui:
	$(MAKE) -C packages/ui build

nginx-proxy:
	$(MAKE) -C packages/nginx-proxy build
