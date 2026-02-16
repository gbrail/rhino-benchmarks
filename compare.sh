#!/bin/sh

if [ $# -ne 2 ]
then
  echo "Usage: compare <file1> <file2>"
  exit 2
fi

./gradlew compare -q --console=plain --args="${1} ${2}"
