IMAGE_TAG ?= registry.gitlab.com/skn0tt/ente/api:latest

build: src
	cd ../.. && \
	docker build \
		-t $(IMAGE_TAG) \
		-f packages/api/Dockerfile \
		.
