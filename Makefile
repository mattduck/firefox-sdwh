.PHONY: build

build:
	zip -v -r -FS ../firefox-sdwh.zip * --exclude *.git* Makefile
