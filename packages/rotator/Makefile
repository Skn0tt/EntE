IMAGE_TAG ?= registry.gitlab.com/skn0tt/ente/rotator:latest

build: src
	cd ../.. && \
	docker build \
		-t $(IMAGE_TAG) \
		-f packages/rotator/Dockerfile \
		.
