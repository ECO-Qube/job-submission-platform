all:

empa-build:
	docker build -t cristianohelio/job-submission-platform:latest --platform=linux/amd64 . && docker push cristianohelio/job-submission-platform:latest

all: empa-build

.PHONY: all empa-build
