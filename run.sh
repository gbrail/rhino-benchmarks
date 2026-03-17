#!/bin/sh

export CLASSPATH=$(./gradlew -q printClasspath)

java \
	-XX:MaxGCPauseMillis=50 \
        -XX:-TieredCompilation \
        -Xms4G \
        -Xmx4G \
        -Xbatch \
	org.brail.rhinobenchmarks.Main $*
