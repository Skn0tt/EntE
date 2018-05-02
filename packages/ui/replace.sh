#!/bin/bash

sed -i 's/<p>{{config}}<\/p>/<script src="\/config.js"><\/script>/g' /app/index.html