#!/bin/bash
git fetch && git pull

cd ./client
npm ci
npm run build

cd ../server
npm ci
pm2 reload boostart