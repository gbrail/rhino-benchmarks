SRC_DIR = $(realpath ../../JetStream)
TGT_DIR = $(realpath ..)

SOURCES = \
	  $(wildcard $(SRC_DIR)/SunSpider/*.js) \
	  $(wildcard $(SRC_DIR)/ARES-6/Air/*.js) \
	  $(wildcard $(SRC_DIR)/cdjs/*.js) \
	  $(wildcard $(SRC_DIR)/Octane/*.js) \
	  $(wildcard $(SRC_DIR)/RexBench/UniPoker/*.js) \
	  $(wildcard $(SRC_DIR)/RexBench/OfflineAssembler/*.js) \
	  $(wildcard $(SRC_DIR)/simple/*.js) \
	  $(wildcard $(SRC_DIR)/bigint/*.js) 

SOURCES := $(filter-out %/, $(SOURCES))

TARGETS = $(patsubst $(SRC_DIR)/%, $(TGT_DIR)/%, $(SOURCES))

all: $(TARGETS) 

$(TGT_DIR)/%: $(SRC_DIR)/%
	npx babel $< > $@

debug:
	@echo "Sources: " $(SOURCES)
	@echo "Targets: " $(TARGETS)


