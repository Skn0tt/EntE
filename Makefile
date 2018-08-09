dev:
	docker-compose \
		-f docker-compose.yml \
		-f docker-compose.dev.yml \
		up -d

build-docker: ente-api ente-ui

ente-api:
	$(MAKE) -C packages/ente-api build

ente-ui:
	$(MAKE) -C packages/ente-ui build
