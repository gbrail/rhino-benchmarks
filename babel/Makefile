SRC_DIR = $(realpath ../../JetStream)
TGT_DIR = $(realpath ..)
THIS_DIR = $(realpath .)

SOURCES = \
	  $(wildcard $(SRC_DIR)/SunSpider/*.js) \
	  $(wildcard $(SRC_DIR)/ARES-6/Air/*.js) \
	  $(wildcard $(SRC_DIR)/ARES-6/ml/*.js) \
	  $(wildcard $(SRC_DIR)/cdjs/*.js) \
	  $(wildcard $(SRC_DIR)/RexBench/UniPoker/*.js) \
	  $(wildcard $(SRC_DIR)/RexBench/OfflineAssembler/*.js) \
	  $(wildcard $(SRC_DIR)/RexBench/FlightPlanner/*.js) \
	  $(wildcard $(SRC_DIR)/simple/*.js) \
	  $(wildcard $(SRC_DIR)/SeaMonster/*.js) \
	  $(wildcard $(SRC_DIR)/bigint/*.js) \
	  $(wildcard $(SRC_DIR)/threejs/*.js) \
	  $(wildcard $(SRC_DIR)/WSL/*.js) 

SOURCES := $(filter-out %/, $(SOURCES))

LOCAL_SOURCES = $(wildcard $(THIS_DIR)/Octane/*.js)
#LOCAL_SOURCES := $(filter-out %/, $(LOCAL-SOURCES))

TARGETS = $(patsubst $(SRC_DIR)/%, $(TGT_DIR)/%, $(SOURCES))
LOCAL_TARGETS = $(patsubst $(THIS_DIR)/%, $(TGT_DIR)/%, $(LOCAL_SOURCES))
Z_TARGETS = $(TGT_DIR)/RexBench/FlightPlanner/waypoints.js.z \
  $(TGT_DIR)/SeaMonster/inspector-json-payload.js.z

all: $(TARGETS) $(LOCAL_TARGETS) $(Z_TARGETS)

$(TGT_DIR)/%: $(THIS_DIR)/% babel.config.json
	npx babel $< > $@
	@[ -s $@ ] || { rm -f $@; exit 1; }

$(TGT_DIR)/%: $(SRC_DIR)/% babel.config.json
	npx babel $< > $@
	@[ -s $@ ] || { rm -f $@; exit 1; }

$(TGT_DIR)/RexBench/FlightPlanner/waypoints.js.z: $(SRC_DIR)/RexBench/FlightPlanner/waypoints.js.z
	cp $< $@
$(TGT_DIR)/SeaMonster/inspector-json-payload.js.z: $(SRC_DIR)/SeaMonster/inspector-json-payload.js.z
	cp $< $@

debug:
	@echo "Local sources: " $(LOCAL_SOURCES)
	@echo "Sources: " $(SOURCES) 
	@echo "Targets: " $(TARGETS) $(LOCAL_TARGETS)


