SRC_DIR = ../../JetStream
TGT_DIR = ..

SOURCES = \
	  $(wildcard $(SRC_DIR)/SunSpider/*.js) \
	  $(wildcard $(SRC_DIR)/ARES-6/Basic/*.js) \
	  $(wildcard $(SRC_DIR)/cdjs/*.js) \
	  $(wildcard $(SRC_DIR)/Octane/*.js)
SOURCES := $(filter-out %/, $(SOURCES))

TARGETS = $(patsubst $(SRC_DIR)/%, $(TGT_DIR)/%, $(SOURCES))

all: $(TARGETS) ../src/main/resources/JetStreamDriver.js

../src/main/resources/JetStreamDriver.js: ./JetStreamDriver.js
	npx babel $< > $@

$(TGT_DIR)/%: $(SRC_DIR)/%
	npx babel $< > $@

JetStreamDriver.js: babel.config.json

debug:
	@echo "Sources: " $(SOURCES)
	@echo "Targets: " $(TARGETS)


