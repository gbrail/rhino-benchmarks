#!/bin/sh

JETSTREAM=../../JetStream

if [ ! -f ./babel.config.json ]
then
  echo "Must be in babel directory"
  exit 1
fi

if [ ! -f ${JETSTREAM}/README.md ]
then
  echo "JETSTREAM must point to the JetStream source"
  exit 2
fi

echo "JetStreamDriver.js"
npx babel ./JetStreamDriver.js > ../src/main/resources/JetStreamDriver.js

function processDirectory() {
  for n in ${JETSTREAM}/$1/*.js
  do
    echo $n...
    out=../$1/$(basename $n)
    npx babel $n > $out
  done
}

processDirectory SunSpider
