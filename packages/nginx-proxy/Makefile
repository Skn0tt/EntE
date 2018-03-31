IMAGE_TAG ?= registry.gitlab.com/skn0tt/ente/nginx-proxy:latest

build: Dockerfile proxy.conf
	docker build \
		-t $(IMAGE_TAG) \
		.
