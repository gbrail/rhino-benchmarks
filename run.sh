#!/bin/sh

out=result.json
if [ $# -eq 1 ]
then
  out=$1
fi

./gradlew run -q --console=plain --args="$*"
