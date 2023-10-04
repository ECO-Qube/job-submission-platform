all:

empa-build:
	docker build -t cristianohelio/job-submission-platform:empa --platform=linux/amd64 . && docker push cristianohelio/job-submission-platform:empa

all: empa-build

.PHONY: all empa-build
