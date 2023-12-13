#!/usr/bin/env bash

CONTAINER=false
if [[ "$1" == "--container" ]] || [[ "$1" == "-c" ]]; then
  CONTAINER=true
fi

if $CONTAINER; then
  npm run build || { echo "build failure"; exit 1; }
  docker build -t riz-ui:dev .
  docker run -d \
    --restart=always \
    -p 8000:80 \
    --name riz-ui \
    --hostname riz-ui \
    riz-ui:dev || { echo "failed to start container"; exit 1; }
else
  npm run serve
fi
