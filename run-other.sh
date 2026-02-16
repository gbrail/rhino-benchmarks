#!/bin/sh

if [ $# -ne 2 ]
then
  echo "Usage: benchmark.sh <rhino JAR> <output JSON>"
  exit 2
fi

allDeps=$(./gradlew -q printDependencies | grep -v rhino)
depClasspath=$(echo "$allDeps" | tr '\n' ':')

java \
  -classpath ${depClasspath}:build/libs/rhino-benchmarks.jar:${1} \
  -XX:MaxGCPauseMillis=50 \
  -XX:-TieredCompilation \
  -Xms4G \
  -Xmx4G \
  -Xbatch \
  org.brail.rhinobenchmarks.Main \
  -j ${2}
