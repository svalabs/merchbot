#!/bin/sh
export CURRENT_USER="`id -u`:`id -g`"
docker-compose -f docker-compose.yml up -d
