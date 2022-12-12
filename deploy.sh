#!/bin/bash
git fetch && git pull

cd ./client
npm install
npm run build

cd ../server
npm install
nohup npm start