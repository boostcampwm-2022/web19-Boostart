#!/bin/bash

cd ./client
npm ci
npm run build:prod

cd ../server
npm ci
nohup npm start