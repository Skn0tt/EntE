IMAGE_TAG ?= registry.gitlab.com/skn0tt/ente/ui:latest

build: src
	cd ../.. && \
	docker build \
		-t $(IMAGE_TAG) \
		-f packages/ui/Dockerfile \
		.
